import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizePlainText } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  OurMissionDisplayOrderItem,
  OurMissionListPayload,
  OurMissionRow,
  OurMissionUpsertPayload,
} from "@/src/types/admin-api";

type OurMissionDbRow = RowDataPacket & {
  id: number;
  content: string;
  display_order: number;
  is_active: number;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function mapMissionRow(row: OurMissionDbRow): OurMissionRow {
  return {
    id: row.id,
    content: sanitizePlainText(row.content),
    displayOrder: row.display_order,
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const DEFAULT_MISSIONS = [
  "To empower enterprises to design, deploy, and orchestrate AI agents that automate complex workflows and unlock new levels of productivity.",
  "To ensure that AI systems operate with trust, governance, and transparency so organizations can scale AI responsibly.",
  "To create a unified platform where humans and AI agents collaborate seamlessly to transform how businesses operate and innovate.",
];

export async function ensureOurMissionsTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS our_missions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content TEXT NOT NULL,
      display_order INT NOT NULL DEFAULT 1,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_display_order (display_order),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Clean up any duplicate records created by concurrent initial requests
  await pool.execute(`
    DELETE t1 FROM our_missions t1
    INNER JOIN our_missions t2 
    ON t1.content = t2.content
    WHERE t1.id > t2.id
  `);

  const existing = await queryRows<OurMissionDbRow>(`SELECT id FROM our_missions LIMIT 1`);
  if (!existing.length) {
    for (let index = 0; index < DEFAULT_MISSIONS.length; index++) {
      await pool.execute(
        `INSERT INTO our_missions (content, display_order, is_active)
         SELECT ?, ?, 1
         FROM DUAL
         WHERE NOT EXISTS (
           SELECT 1 FROM our_missions WHERE content = ?
         )`,
        [DEFAULT_MISSIONS[index], index + 1, DEFAULT_MISSIONS[index]],
      );
    }
  }
}

export async function listOurMissions(
  filter: OurMissionListPayload = {},
): Promise<OurMissionRow[]> {
  await ensureOurMissionsTable();

  const search = filter.search?.trim() || "";
  const params: (string | number)[] = [];
  const whereClauses: string[] = [];

  if (search) {
    whereClauses.push("content LIKE ?");
    params.push(`%${search}%`);
  }

  if (typeof filter.isActive === "boolean") {
    whereClauses.push("is_active = ?");
    params.push(filter.isActive ? 1 : 0);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const rows = await queryRows<OurMissionDbRow>(
    `SELECT id, content, display_order, is_active, created_at, updated_at
     FROM our_missions
     ${whereSql}
     ORDER BY display_order ASC, id ASC`,
    params,
  );

  return rows.map(mapMissionRow);
}

export async function getOurMissionById(id: number): Promise<OurMissionRow | null> {
  await ensureOurMissionsTable();
  const rows = await queryRows<OurMissionDbRow>(
    `SELECT id, content, display_order, is_active, created_at, updated_at
     FROM our_missions
     WHERE id = ?`,
    [id],
  );
  return rows[0] ? mapMissionRow(rows[0]) : null;
}

export async function upsertOurMission(payload: OurMissionUpsertPayload): Promise<OurMissionRow> {
  await ensureOurMissionsTable();
  const pool = getMysqlPool();

  const content = sanitizePlainText(payload.content);
  if (!content) {
    throw new Error("Content is required for mission item.");
  }
  if (content.length > 350) {
    throw new Error("Content must be 350 characters or less.");
  }

  const isActive = payload.isActive ?? true;

  if (payload.id && payload.id > 0) {
    const displayOrder = payload.displayOrder ?? 1;
    await pool.execute(
      `UPDATE our_missions
       SET content = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [content, displayOrder, isActive ? 1 : 0, payload.id],
    );
    const updated = await getOurMissionById(payload.id);
    if (!updated) throw new Error("Failed to find updated mission item.");
    return updated;
  }

  let nextOrder = payload.displayOrder;
  if (!nextOrder) {
    const maxRow = await queryRows<OurMissionDbRow>(
      `SELECT MAX(display_order) as max_order FROM our_missions`,
    );
    const currentMax = maxRow[0] && typeof maxRow[0].max_order === "number" ? maxRow[0].max_order : 0;
    nextOrder = currentMax + 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO our_missions (content, display_order, is_active)
     VALUES (?, ?, ?)`,
    [content, nextOrder, isActive ? 1 : 0],
  );

  const inserted = await getOurMissionById(Number(result.insertId));
  if (!inserted) throw new Error("Failed to retrieve created mission item.");
  return inserted;
}

export async function deleteOurMission(id: number): Promise<boolean> {
  await ensureOurMissionsTable();
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `DELETE FROM our_missions WHERE id = ?`,
    [id],
  );
  return result.affectedRows > 0;
}

export async function updateOurMissionsDisplayOrder(
  items: OurMissionDisplayOrderItem[],
): Promise<void> {
  await ensureOurMissionsTable();
  const pool = getMysqlPool();
  for (const item of items) {
    await pool.execute(
      `UPDATE our_missions SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [item.displayOrder, item.id],
    );
  }
}
