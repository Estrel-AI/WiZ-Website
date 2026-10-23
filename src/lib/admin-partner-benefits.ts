import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizeExternalOrRelativeUrl, sanitizePlainText } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  PartnerBenefitDisplayOrderItem,
  PartnerBenefitRow,
  PartnerBenefitUpsertPayload,
} from "@/src/types/admin-api";

type PartnerBenefitDbRow = RowDataPacket & {
  id: number;
  title: string;
  description: string;
  image: string;
  display_order: number;
  is_active: number;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function mapBenefitRow(row: PartnerBenefitDbRow): PartnerBenefitRow {
  return {
    id: row.id,
    title: sanitizePlainText(row.title),
    description: sanitizePlainText(row.description),
    image: sanitizeExternalOrRelativeUrl(row.image) || "",
    displayOrder: row.display_order,
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const DEFAULT_BENEFITS = [
  {
    title: "Revenue Growth",
    description: "Unlock new recurring revenue streams and scale your business sustainably.",
    image: "/api/assets/dummy_image/revenue_growth.jpg",
  },
  {
    title: "Co-Marketing & Global Reach",
    description: "Expand reach through joint marketing campaigns, event sponsorships, and qualified lead sharing.",
    image: "/api/assets/dummy_image/partners-banner-img.jpg",
  },
  {
    title: "Technical Enablement",
    description: "Direct access to engineering support, early product roadmaps, and certification training.",
    image: "/api/assets/dummy_image/about_section.png",
  },
];

export async function ensurePartnerBenefitsTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS partner_benefits (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(500) NOT NULL,
      display_order INT NOT NULL DEFAULT 1,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_display_order (display_order),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.execute(`
    DELETE t1 FROM partner_benefits t1
    INNER JOIN partner_benefits t2 
    ON t1.title = t2.title
    WHERE t1.id > t2.id
  `);

  const existing = await queryRows<PartnerBenefitDbRow>(`SELECT id FROM partner_benefits LIMIT 1`);
  if (!existing.length) {
    for (let index = 0; index < DEFAULT_BENEFITS.length; index++) {
      const item = DEFAULT_BENEFITS[index];
      await pool.execute(
        `INSERT INTO partner_benefits (title, description, image, display_order, is_active)
         SELECT ?, ?, ?, ?, 1
         FROM DUAL
         WHERE NOT EXISTS (
           SELECT 1 FROM partner_benefits WHERE title = ?
         )`,
        [item.title, item.description, item.image, index + 1, item.title],
      );
    }
  }
}

export async function listPartnerBenefits(
  filter: { search?: string; isActive?: boolean | null } = {},
): Promise<PartnerBenefitRow[]> {
  await ensurePartnerBenefitsTable();

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

  const rows = await queryRows<PartnerBenefitDbRow>(
    `SELECT id, title, description, image, display_order, is_active, created_at, updated_at
     FROM partner_benefits
     ${whereSql}
     ORDER BY display_order ASC, id ASC`,
    params,
  );

  return rows.map(mapBenefitRow);
}

export async function getPartnerBenefitById(id: number): Promise<PartnerBenefitRow | null> {
  await ensurePartnerBenefitsTable();
  const rows = await queryRows<PartnerBenefitDbRow>(
    `SELECT id, title, description, image, display_order, is_active, created_at, updated_at
     FROM partner_benefits
     WHERE id = ?`,
    [id],
  );
  return rows[0] ? mapBenefitRow(rows[0]) : null;
}

export async function upsertPartnerBenefit(
  payload: PartnerBenefitUpsertPayload,
): Promise<PartnerBenefitRow> {
  await ensurePartnerBenefitsTable();
  const pool = getMysqlPool();

const title = sanitizePlainText(payload.title);
    if (!title) throw new Error("Title is required.");
    if (title.length > 100) throw new Error("Title must be 100 characters or less.");

    const description = sanitizePlainText(payload.description);
    if (!description) throw new Error("Description is required.");
    if (description.length > 300) throw new Error("Description must be 300 characters or less.");

  const image = sanitizeExternalOrRelativeUrl(payload.image);
  if (!image) throw new Error("Image is required.");

  const isActive = payload.isActive ?? true;

  if (payload.id && payload.id > 0) {
    const displayOrder = payload.displayOrder ?? 1;
    await pool.execute(
      `UPDATE partner_benefits
       SET title = ?, description = ?, image = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, image, displayOrder, isActive ? 1 : 0, payload.id],
    );
    const updated = await getPartnerBenefitById(payload.id);
    if (!updated) throw new Error("Failed to find updated benefit.");
    return updated;
  }

  let nextOrder = payload.displayOrder;
  if (!nextOrder) {
    const maxRow = await queryRows<PartnerBenefitDbRow>(
      `SELECT MAX(display_order) as max_order FROM partner_benefits`,
    );
    const currentMax = maxRow[0] && typeof maxRow[0].max_order === "number" ? maxRow[0].max_order : 0;
    nextOrder = currentMax + 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO partner_benefits (title, description, image, display_order, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, image, nextOrder, isActive ? 1 : 0],
  );

  const inserted = await getPartnerBenefitById(Number(result.insertId));
  if (!inserted) throw new Error("Failed to retrieve created benefit.");
  return inserted;
}

export async function deletePartnerBenefit(id: number): Promise<boolean> {
  await ensurePartnerBenefitsTable();
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `DELETE FROM partner_benefits WHERE id = ?`,
    [id],
  );
  return result.affectedRows > 0;
}

export async function updatePartnerBenefitsDisplayOrder(
  items: PartnerBenefitDisplayOrderItem[],
): Promise<void> {
  await ensurePartnerBenefitsTable();
  const pool = getMysqlPool();
  for (const item of items) {
    await pool.execute(
      `UPDATE partner_benefits SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [item.displayOrder, item.id],
    );
  }
}
