import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizeExternalOrRelativeUrl } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  ListData,
  TrustedByLogoDisplayOrderPayload,
  TrustedByLogoListPayload,
  TrustedByLogoRow,
  TrustedByLogoStatus,
  TrustedByLogoUpsertPayload,
} from "@/src/types/admin-api";

type TrustedByLogoDbRow = RowDataPacket & {
  id: number;
  logo_image: string;
  sort_order: number;
  status: TrustedByLogoStatus;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapRow(row: TrustedByLogoDbRow): TrustedByLogoRow {
  return {
    id: row.id,
    logoImage: sanitizeExternalOrRelativeUrl(row.logo_image) ?? "",
    sortOrder: Number(row.sort_order),
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function normalizeStatus(value?: TrustedByLogoStatus | null): TrustedByLogoStatus {
  return value === "inactive" ? "inactive" : "active";
}

function normalizeSortOrder(value?: number | null) {
  const sortOrder = Number(value ?? 0);
  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("Sort order must be a non-negative integer.");
  }
  return sortOrder;
}

function normalizeLogoImage(value: string | null | undefined) {
  const logoImage = sanitizeExternalOrRelativeUrl(value);
  if (!logoImage) {
    throw new Error("Logo image is required.");
  }
  return logoImage;
}

export async function listTrustedByLogos(payload: TrustedByLogoListPayload): Promise<ListData<TrustedByLogoRow>> {
  const page = Math.max(1, Math.floor(Number(payload.page ?? 1)));
  const limit = Math.min(50, Math.max(1, Math.floor(Number(payload.limit ?? 10))));
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const params: Array<string | number> = [];
  const search = payload.search?.trim();

  if (search) {
    conditions.push("logo_image LIKE ?");
    params.push(`%${search}%`);
  }
  if (payload.status) {
    conditions.push("status = ?");
    params.push(payload.status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows, countRows] = await Promise.all([
    queryRows<TrustedByLogoDbRow>(
      `SELECT id, logo_image, sort_order, status, created_at, updated_at
       FROM trusted_by_logos ${where}
       ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    ),
    queryRows<RowDataPacket & { total: number }>(
      `SELECT COUNT(*) AS total FROM trusted_by_logos ${where}`,
      params,
    ),
  ]);

  return { result: rows.map(mapRow), count: Number(countRows[0]?.total ?? 0) };
}

export async function listActiveTrustedByLogos() {
  const rows = await queryRows<TrustedByLogoDbRow>(
    `SELECT id, logo_image, sort_order, status, created_at, updated_at
     FROM trusted_by_logos WHERE status = 'active'
     ORDER BY sort_order ASC, id ASC`,
  );
  return rows.map(mapRow);
}

export async function upsertTrustedByLogo(payload: TrustedByLogoUpsertPayload) {
  const logoImage = normalizeLogoImage(payload.logoImage);
  const sortOrder = normalizeSortOrder(payload.sortOrder);
  const status = normalizeStatus(payload.status);
  const requestedId = Number(payload.id ?? 0);
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();
    const [duplicateLogo] = await connection.query<Array<RowDataPacket & { id: number }>>(
      `SELECT id FROM trusted_by_logos WHERE logo_image = ? AND id <> ? LIMIT 1`,
      [logoImage, requestedId],
    );
    if (duplicateLogo[0]) {
      throw new Error("This logo image is already used.");
    }

    if (status === "active") {
      const [duplicateOrder] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM trusted_by_logos WHERE sort_order = ? AND status = 'active' AND id <> ? LIMIT 1`,
        [sortOrder, requestedId],
      );
      if (duplicateOrder[0]) {
        throw new Error("Sort order must be unique for active logos.");
      }
    }

    if (requestedId > 0) {
      const [existing] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM trusted_by_logos WHERE id = ? LIMIT 1`, [requestedId],
      );
      if (!existing[0]) throw new Error("Trusted By logo not found.");
      await connection.execute<ResultSetHeader>(
        `UPDATE trusted_by_logos SET logo_image = ?, sort_order = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [logoImage, sortOrder, status, requestedId],
      );
      await connection.commit();
      return { id: requestedId, action: "updated" as const };
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO trusted_by_logos (logo_image, sort_order, status) VALUES (?, ?, ?)`,
      [logoImage, sortOrder, status],
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

export async function deleteTrustedByLogo(id: number) {
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE trusted_by_logos SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [id],
  );
  return result.affectedRows > 0;
}

export async function updateTrustedByLogoStatus(id: number, status: TrustedByLogoStatus) {
  if (status === "active") {
    const rows = await queryRows<RowDataPacket & { sort_order: number }>(
      `SELECT sort_order FROM trusted_by_logos WHERE id = ?`, [id],
    );
    const sortOrder = rows[0]?.sort_order;
    if (sortOrder === undefined) throw new Error("Trusted By logo not found.");
    const duplicate = await queryRows<RowDataPacket & { id: number }>(
      `SELECT id FROM trusted_by_logos WHERE sort_order = ? AND status = 'active' AND id <> ? LIMIT 1`, [sortOrder, id],
    );
    if (duplicate[0]) throw new Error("Sort order must be unique for active logos.");
  }
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE trusted_by_logos SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, id],
  );
  if (!result.affectedRows) throw new Error("Trusted By logo not found.");
}

export async function updateTrustedByLogoImage(id: number, logoImage: string) {
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE trusted_by_logos SET logo_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [normalizeLogoImage(logoImage), id],
  );
  if (!result.affectedRows) throw new Error("Trusted By logo not found.");
}

export async function updateTrustedByLogoOrder(payload: TrustedByLogoDisplayOrderPayload) {
  if (!payload.items.length) throw new Error("At least one order item is required.");
  const connection = await getMysqlPool().getConnection();
  try {
    await connection.beginTransaction();
    for (const item of payload.items) {
      const sortOrder = normalizeSortOrder(item.sortOrder);
      await connection.execute<ResultSetHeader>(
        `UPDATE trusted_by_logos SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [sortOrder, item.id],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
