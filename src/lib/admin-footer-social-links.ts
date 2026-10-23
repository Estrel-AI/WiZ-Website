import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizeExternalOrRelativeUrl, sanitizePlainText } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  FooterSocialLinkDisplayOrderItem,
  FooterSocialLinkRow,
  FooterSocialLinkUpsertPayload,
} from "@/src/types/admin-api";

type FooterSocialLinkDbRow = RowDataPacket & {
  id: number;
  platform_name: string;
  icon: string;
  url: string;
  display_order: number;
  status: number;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function mapSocialLinkRow(row: FooterSocialLinkDbRow): FooterSocialLinkRow {
  return {
    id: row.id,
    platformName: sanitizePlainText(row.platform_name),
    icon: sanitizePlainText(row.icon) || "globe",
    url: sanitizeExternalOrRelativeUrl(row.url) || "#",
    displayOrder: row.display_order,
    isActive: Boolean(row.status),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const DEFAULT_SOCIAL_LINKS = [
  {
    platformName: "LinkedIn",
    icon: "linkedin",
    url: "https://www.linkedin.com/showcase/estrel-wiiz-it/",
    displayOrder: 1,
  },
  {
    platformName: "Instagram",
    icon: "instagram",
    url: "https://www.instagram.com/wiiz.it?",
    displayOrder: 2,
  },
  {
    platformName: "YouTube",
    icon: "youtube",
    url: "https://youtube.com/@wiiz-it?si=Zih4KEVCWIAuvSfD",
    displayOrder: 3,
  },
  {
    platformName: "Product Hunt",
    icon: "producthunt",
    url: "https://www.producthunt.com/products/wiiz?launch=wiiz-altas-2-0-public-beta",
    displayOrder: 4,
  },
];

export async function ensureFooterSocialLinksTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS footer_social_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      platform_name VARCHAR(100) NOT NULL,
      icon VARCHAR(100) NOT NULL,
      url VARCHAR(500) NOT NULL,
      display_order INT NOT NULL DEFAULT 0,
      status TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.execute(`
    DELETE t1 FROM footer_social_links t1
    INNER JOIN footer_social_links t2
    ON t1.platform_name = t2.platform_name AND t1.id > t2.id;
  `);

  for (const link of DEFAULT_SOCIAL_LINKS) {
    await pool.execute(
      `INSERT INTO footer_social_links (platform_name, icon, url, display_order, status)
       SELECT ?, ?, ?, ?, 1
       WHERE NOT EXISTS (
         SELECT 1 FROM footer_social_links WHERE platform_name = ?
       )`,
      [link.platformName, link.icon, link.url, link.displayOrder, link.platformName],
    );
  }
}

export async function getAllFooterSocialLinksAdmin(): Promise<FooterSocialLinkRow[]> {
  await ensureFooterSocialLinksTable();
  const rows = await queryRows<FooterSocialLinkDbRow>(
    "SELECT * FROM footer_social_links ORDER BY display_order ASC, id ASC",
  );
  return rows.map(mapSocialLinkRow);
}

export async function getActiveFooterSocialLinks(): Promise<FooterSocialLinkRow[]> {
  await ensureFooterSocialLinksTable();
  const rows = await queryRows<FooterSocialLinkDbRow>(
    "SELECT * FROM footer_social_links WHERE status = 1 ORDER BY display_order ASC, id ASC",
  );
  return rows.map(mapSocialLinkRow);
}

export async function getFooterSocialLinkById(id: number): Promise<FooterSocialLinkRow | null> {
  await ensureFooterSocialLinksTable();
  const rows = await queryRows<FooterSocialLinkDbRow>(
    "SELECT * FROM footer_social_links WHERE id = ? LIMIT 1",
    [id],
  );
  if (rows.length === 0) return null;
  return mapSocialLinkRow(rows[0]);
}

export async function upsertFooterSocialLink(
  payload: FooterSocialLinkUpsertPayload,
): Promise<FooterSocialLinkRow> {
  await ensureFooterSocialLinksTable();
  const pool = getMysqlPool();

  const platformName = sanitizePlainText(payload.platformName);
  const icon = sanitizePlainText(payload.icon) || "globe";
  const url = sanitizeExternalOrRelativeUrl(payload.url) || "#";
  const status = payload.isActive ?? true ? 1 : 0;

  if (payload.id && payload.id > 0) {
    const existing = await getFooterSocialLinkById(payload.id);
    if (!existing) throw new Error("Social link not found.");
    const displayOrder = payload.displayOrder ?? existing.displayOrder;

    await pool.execute(
      `UPDATE footer_social_links
       SET platform_name = ?, icon = ?, url = ?, display_order = ?, status = ?
       WHERE id = ?`,
      [platformName, icon, url, displayOrder, status, payload.id],
    );

    const updated = await getFooterSocialLinkById(payload.id);
    if (!updated) throw new Error("Failed to retrieve updated social link.");
    return updated;
  }

  let nextOrder = payload.displayOrder;
  if (nextOrder === undefined || nextOrder === null) {
    const maxRows = await queryRows<RowDataPacket & { maxOrder: number | null }>(
      "SELECT MAX(display_order) as maxOrder FROM footer_social_links",
    );
    nextOrder = (maxRows[0]?.maxOrder ?? 0) + 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO footer_social_links (platform_name, icon, url, display_order, status)
     VALUES (?, ?, ?, ?, ?)`,
    [platformName, icon, url, nextOrder, status],
  );

  const created = await getFooterSocialLinkById(result.insertId);
  if (!created) throw new Error("Failed to retrieve created social link.");
  return created;
}

export async function updateFooterSocialLinksDisplayOrder(
  items: FooterSocialLinkDisplayOrderItem[],
): Promise<void> {
  await ensureFooterSocialLinksTable();
  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    for (const item of items) {
      await connection.execute(
        "UPDATE footer_social_links SET display_order = ? WHERE id = ?",
        [item.displayOrder, item.id],
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

export async function deleteFooterSocialLink(id: number): Promise<boolean> {
  await ensureFooterSocialLinksTable();
  const pool = getMysqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM footer_social_links WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}
