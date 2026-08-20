import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  sanitizeNullablePlainText,
  sanitizeNullableRichHtml,
  sanitizePlainText,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type { ListData, PlanListPayload, PlanRow, PlanUpsertPayload } from "@/src/types/admin-api";

type PlanDbRow = RowDataPacket & {
  id: number;
  plan_code: string | null;
  short_description: string | null;
  highlighted_features: string | null;
  features: string | null;
  hide: number | boolean;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapPlanRow(row: PlanDbRow): PlanRow {
  return {
    id: row.id,
    planCode: row.plan_code ? sanitizePlainText(row.plan_code) : null,
    shortDescription: sanitizeNullablePlainText(row.short_description),
    highlightedFeatures: sanitizeNullableRichHtml(row.highlighted_features),
    features: sanitizeNullableRichHtml(row.features),
    show: !Boolean(row.hide),
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function normalizePlanCode(value: string | null | undefined) {
  const planCode = value?.trim() ?? "";
  return planCode || null;
}

export async function listPlans(payload: PlanListPayload): Promise<ListData<PlanRow>> {
  const conditions = ["is_active = 1"];
  const params: Array<string | number> = [];

  if (typeof payload.hide === "boolean") {
    conditions.push("hide = ?");
    params.push(payload.hide ? 1 : 0);
  }

  const search = payload.search?.trim();
  if (search) {
    const like = `%${search}%`;
    conditions.push("(plan_code LIKE ? OR short_description LIKE ? OR highlighted_features LIKE ? OR features LIKE ?)");
    params.push(like, like, like, like);
  }

  const whereSql = conditions.join(" AND ");

  const rows = await queryRows<PlanDbRow>(
    `SELECT id, plan_code, short_description, highlighted_features, features, hide, is_active, created_at, updated_at
     FROM plans
     WHERE ${whereSql}
     ORDER BY created_at DESC`,
    params,
  );

  return {
    result: rows.map(mapPlanRow),
    count: rows.length,
  };
}

export async function getPlanById(id: number) {
  const rows = await queryRows<PlanDbRow>(
    `SELECT id, plan_code, short_description, highlighted_features, features, hide, is_active, created_at, updated_at
     FROM plans
     WHERE id = ? AND is_active = 1`,
    [id],
  );

  const row = rows[0];
  return row ? mapPlanRow(row) : null;
}

export async function upsertPlan(payload: PlanUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    const planCode = normalizePlanCode(payload.planCode);
    const shortDescription = sanitizeNullablePlainText(payload.shortDescription);
    const highlightedFeatures = sanitizeNullableRichHtml(payload.highlightedFeatures);
    const features = sanitizeNullableRichHtml(payload.features);
    const hide = payload.show ? 0 : 1;
    const requestedId = Number(payload.id ?? 0);

    if (requestedId > 0) {
      const [existingRows] = await connection.query<PlanDbRow[]>(
        `SELECT id FROM plans WHERE id = ? AND is_active = 1`,
        [requestedId],
      );

      if (!existingRows[0]) {
        throw new Error("Plan not found.");
      }

      if (planCode !== null) {
        const [duplicateRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
          `SELECT id FROM plans WHERE plan_code = ? AND id <> ? AND is_active = 1`,
          [planCode, requestedId],
        );

        if (duplicateRows[0]) {
          throw new Error("Plan code must be unique.");
        }
      }

      await connection.execute<ResultSetHeader>(
        `UPDATE plans
         SET plan_code = ?, short_description = ?, highlighted_features = ?, features = ?, hide = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [planCode, shortDescription, highlightedFeatures, features, hide, requestedId],
      );

      await connection.commit();
      return { id: requestedId, action: "updated" as const };
    }

    if (planCode !== null) {
      const [duplicateRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM plans WHERE plan_code = ? AND is_active = 1`,
        [planCode],
      );

      if (duplicateRows[0]) {
        throw new Error("Plan code must be unique.");
      }
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO plans (plan_code, short_description, highlighted_features, features, hide, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [planCode, shortDescription, highlightedFeatures, features, hide],
    );

    await connection.commit();
    return { id: Number(result.insertId), action: "created" as const };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deletePlan(id: number) {
  const result = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE plans
     SET is_active = 0, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [id],
  );

  return result[0].affectedRows > 0;
}

export async function updatePlanVisibility(id: number, show: boolean) {
  const result = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE plans
     SET hide = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [show ? 0 : 1, id],
  );

  return result[0].affectedRows > 0;
}
