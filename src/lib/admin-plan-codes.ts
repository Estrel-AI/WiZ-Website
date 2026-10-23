import { queryRows } from "@/src/lib/mysql";
import type { RowDataPacket } from "mysql2/promise";

type PlanCodeDbRow = RowDataPacket & {
  id: number;
  plan_key: string | null;
  plan_code: string | null;
  description: string | null;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

export type PlanCodeRow = {
  id: number;
  planKey: string | null;
  planCode: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

function mapPlanCodeRow(row: PlanCodeDbRow): PlanCodeRow {
  return {
    id: row.id,
    planKey: row.plan_key,
    planCode: row.plan_code,
    description: row.description,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : new Date(row.updated_at).toISOString(),
  };
}

export async function listPlanCodes(): Promise<PlanCodeRow[]> {
  const rows = await queryRows<PlanCodeDbRow>(
    `SELECT id, plan_key, plan_code, description, is_active, created_at, updated_at
     FROM plan_codes
     WHERE is_active = 1
     ORDER BY plan_key ASC`,
    []
  );

  return rows.map(mapPlanCodeRow);
}

export async function getPlanCodeByKey(planKey: string): Promise<PlanCodeRow | null> {
  const rows = await queryRows<PlanCodeDbRow>(
    `SELECT id, plan_key, plan_code, description, is_active, created_at, updated_at
     FROM plan_codes
     WHERE plan_key = ? AND is_active = 1`,
    [planKey]
  );

  return rows.length > 0 ? mapPlanCodeRow(rows[0]) : null;
}

export async function getAllPlanCodesAsMap(): Promise<Record<string, string>> {
  const planCodes = await listPlanCodes();
  const result: Record<string, string> = {};

  for (const pc of planCodes) {
    if (pc.planKey && pc.planCode) {
      result[pc.planKey] = pc.planCode;
    }
  }

  return result;
}