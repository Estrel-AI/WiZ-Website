import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizePlainText } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  PartnerPathwayDisplayOrderItem,
  PartnerPathwayRow,
  PartnerPathwayUpsertPayload,
} from "@/src/types/admin-api";

type PartnerPathwayDbRow = RowDataPacket & {
  id: number;
  title: string;
  description: string;
  points: string | string[];
  button_text: string;
  display_order: number;
  is_active: number;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function parsePoints(raw: string | string[] | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    // If not JSON, split by lines
  }
  return String(raw)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapPathwayRow(row: PartnerPathwayDbRow): PartnerPathwayRow {
  return {
    id: row.id,
    title: sanitizePlainText(row.title),
    description: sanitizePlainText(row.description),
    points: parsePoints(row.points),
    buttonText: sanitizePlainText(row.button_text || "Register Now"),
    displayOrder: row.display_order,
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const DEFAULT_PATHWAYS = [
  {
    title: "System Integration Partner",
    description: "For software reselling and professional services organization.",
    buttonText: "Register Now",
    points: JSON.stringify([
      "Build and deploy robust AI solutions for clients.",
      "Accelerate project delivery and effectively mitigate risks",
      "Receive valuable referrals and expanded co-selling opportunities to grow your business.",
      "Access dedicated technical and sales support.",
    ]),
  },
  {
    title: "Technology Partner",
    description: "For software companies wanting to embed AI orchestration into their own products.",
    buttonText: "Register Now",
    points: JSON.stringify([
      "Embed WiiZ's engine directly into your platform.",
      "Offer unparalleled automation to your customers.",
      "Create new value with a seamless, integrated experience.",
      "Unlock new joint revenue and marketing models.",
    ]),
  },
  {
    title: "Education Partner",
    description: "For institutions training AI to the next generation professionals.",
    buttonText: "Register Now",
    points: JSON.stringify([
      "Access full-tier platform licenses designed specifically for extensive academic use.",
      "Receive industry-recognized certifications that validate skills and expertise.",
      "Deploy a structured, ready-to-use curriculum tailored for effective learning.",
      "Join a global community of AI creators.",
    ]),
  },
];

export async function ensurePartnerPathwaysTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS partner_pathways (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      points TEXT NOT NULL,
      button_text VARCHAR(100) NOT NULL DEFAULT 'Register Now',
      display_order INT NOT NULL DEFAULT 1,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_display_order (display_order),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.execute(`
    DELETE t1 FROM partner_pathways t1
    INNER JOIN partner_pathways t2 
    ON t1.title = t2.title
    WHERE t1.id > t2.id
  `);

  const existing = await queryRows<PartnerPathwayDbRow>(`SELECT id FROM partner_pathways LIMIT 1`);
  if (!existing.length) {
    for (let index = 0; index < DEFAULT_PATHWAYS.length; index++) {
      const item = DEFAULT_PATHWAYS[index];
      await pool.execute(
        `INSERT INTO partner_pathways (title, description, points, button_text, display_order, is_active)
         SELECT ?, ?, ?, ?, ?, 1
         FROM DUAL
         WHERE NOT EXISTS (
           SELECT 1 FROM partner_pathways WHERE title = ?
         )`,
        [item.title, item.description, item.points, item.buttonText, index + 1, item.title],
      );
    }
  }
}

export async function listPartnerPathways(
  filter: { search?: string; isActive?: boolean | null } = {},
): Promise<PartnerPathwayRow[]> {
  await ensurePartnerPathwaysTable();

  const search = filter.search?.trim() || "";
  const params: (string | number)[] = [];
  const whereClauses: string[] = [];

  if (search) {
    whereClauses.push("(title LIKE ? OR description LIKE ?)");
    const pattern = `%${search}%`;
    params.push(pattern, pattern);
  }

  if (typeof filter.isActive === "boolean") {
    whereClauses.push("is_active = ?");
    params.push(filter.isActive ? 1 : 0);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const rows = await queryRows<PartnerPathwayDbRow>(
    `SELECT id, title, description, points, button_text, display_order, is_active, created_at, updated_at
     FROM partner_pathways
     ${whereSql}
     ORDER BY display_order ASC, id ASC`,
    params,
  );

  return rows.map(mapPathwayRow);
}

export async function getPartnerPathwayById(id: number): Promise<PartnerPathwayRow | null> {
  await ensurePartnerPathwaysTable();
  const rows = await queryRows<PartnerPathwayDbRow>(
    `SELECT id, title, description, points, button_text, display_order, is_active, created_at, updated_at
     FROM partner_pathways
     WHERE id = ?`,
    [id],
  );
  return rows[0] ? mapPathwayRow(rows[0]) : null;
}

export async function upsertPartnerPathway(
  payload: PartnerPathwayUpsertPayload,
): Promise<PartnerPathwayRow> {
  await ensurePartnerPathwaysTable();
  const pool = getMysqlPool();

  const title = sanitizePlainText(payload.title);
  if (!title) throw new Error("Title is required.");
  if (title.length > 100) throw new Error("Title must be 100 characters or less.");

  const description = sanitizePlainText(payload.description);
  if (!description) throw new Error("Description is required.");
  if (description.length > 150) throw new Error("Description must be 150 characters or less.");

  const pointsArr = Array.isArray(payload.points)
    ? payload.points.map((p) => sanitizePlainText(p)).filter(Boolean)
    : String(payload.points || "")
        .split("\n")
        .map((p) => sanitizePlainText(p))
        .filter(Boolean);

  if (pointsArr.some((p) => p.length > 90)) {
    throw new Error("Bullet points must be 90 characters or less.");
  }

  const pointsJson = JSON.stringify(pointsArr);
  const buttonText = sanitizePlainText(payload.buttonText || "Register Now");
  const isActive = payload.isActive ?? true;

  if (payload.id && payload.id > 0) {
    const displayOrder = payload.displayOrder ?? 1;
    await pool.execute(
      `UPDATE partner_pathways
       SET title = ?, description = ?, points = ?, button_text = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, pointsJson, buttonText, displayOrder, isActive ? 1 : 0, payload.id],
    );
    const updated = await getPartnerPathwayById(payload.id);
    if (!updated) throw new Error("Failed to find updated pathway.");
    return updated;
  }

  let nextOrder = payload.displayOrder;
  if (!nextOrder) {
    const maxRow = await queryRows<PartnerPathwayDbRow>(
      `SELECT MAX(display_order) as max_order FROM partner_pathways`,
    );
    const currentMax = maxRow[0] && typeof maxRow[0].max_order === "number" ? maxRow[0].max_order : 0;
    nextOrder = currentMax + 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO partner_pathways (title, description, points, button_text, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, pointsJson, buttonText, nextOrder, isActive ? 1 : 0],
  );

  const inserted = await getPartnerPathwayById(Number(result.insertId));
  if (!inserted) throw new Error("Failed to retrieve created pathway.");
  return inserted;
}

export async function deletePartnerPathway(id: number): Promise<boolean> {
  await ensurePartnerPathwaysTable();
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `DELETE FROM partner_pathways WHERE id = ?`,
    [id],
  );
  return result.affectedRows > 0;
}

export async function updatePartnerPathwaysDisplayOrder(
  items: PartnerPathwayDisplayOrderItem[],
): Promise<void> {
  await ensurePartnerPathwaysTable();
  const pool = getMysqlPool();
  for (const item of items) {
    await pool.execute(
      `UPDATE partner_pathways SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [item.displayOrder, item.id],
    );
  }
}
