import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizeExternalOrRelativeUrl, sanitizePlainText } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  FooterResourceLinkDisplayOrderItem,
  FooterResourceLinkRow,
  FooterResourceLinkUpsertPayload,
} from "@/src/types/admin-api";

type FooterResourceLinkDbRow = RowDataPacket & {
  id: number;
  title: string;
  slug: string;
  url: string;
  display_order: number;
  status: number;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapResourceLinkRow(row: FooterResourceLinkDbRow): FooterResourceLinkRow {
  return {
    id: row.id,
    title: sanitizePlainText(row.title),
    slug: sanitizePlainText(row.slug),
    url: sanitizeExternalOrRelativeUrl(row.url) || "#",
    displayOrder: row.display_order,
    isActive: Boolean(row.status),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const DEFAULT_RESOURCE_PAGES = [
  {
    title: "Contact",
    slug: "contact",
    url: "/contact",
    displayOrder: 1,
  },
  {
    title: "Cookie Policy",
    slug: "cookie-policy",
    url: "#cookies",
    displayOrder: 2,
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    url: "#privacy",
    displayOrder: 3,
  },
  {
    title: "Terms and Conditions",
    slug: "terms-and-conditions",
    url: "#terms",
    displayOrder: 4,
  },
];

export async function ensureFooterResourceLinksTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS footer_resource_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      display_order INT NOT NULL DEFAULT 0,
      status TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.execute(`
    DELETE t1 FROM footer_resource_links t1
    INNER JOIN footer_resource_links t2
    ON (t1.slug = t2.slug OR t1.title = t2.title) AND t1.id > t2.id;
  `);

  for (const link of DEFAULT_RESOURCE_PAGES) {
    await pool.execute(
      `INSERT INTO footer_resource_links (title, slug, url, display_order, status)
       SELECT ?, ?, ?, ?, 1
       WHERE NOT EXISTS (
         SELECT 1 FROM footer_resource_links WHERE slug = ? OR title = ?
       )`,
      [link.title, link.slug, link.url, link.displayOrder, link.slug, link.title],
    );
  }
}

export async function getAllFooterResourceLinksAdmin(): Promise<FooterResourceLinkRow[]> {
  await ensureFooterResourceLinksTable();
  const rows = await queryRows<FooterResourceLinkDbRow>(
    "SELECT * FROM footer_resource_links ORDER BY display_order ASC, id ASC",
  );
  return rows.map(mapResourceLinkRow);
}

export async function getActiveFooterResourceLinks(): Promise<FooterResourceLinkRow[]> {
  await ensureFooterResourceLinksTable();
  const rows = await queryRows<FooterResourceLinkDbRow>(
    "SELECT * FROM footer_resource_links WHERE status = 1 ORDER BY display_order ASC, id ASC",
  );
  return rows.map(mapResourceLinkRow);
}

export async function getFooterResourceLinkById(id: number): Promise<FooterResourceLinkRow | null> {
  await ensureFooterResourceLinksTable();
  const rows = await queryRows<FooterResourceLinkDbRow>(
    "SELECT * FROM footer_resource_links WHERE id = ? LIMIT 1",
    [id],
  );
  if (rows.length === 0) return null;
  return mapResourceLinkRow(rows[0]);
}

export async function upsertFooterResourceLink(
  payload: FooterResourceLinkUpsertPayload,
): Promise<FooterResourceLinkRow> {
  await ensureFooterResourceLinksTable();
  const pool = getMysqlPool();

  const title = sanitizePlainText(payload.title);
  const slug = payload.slug?.trim() ? slugify(payload.slug) : slugify(title);
  const url = sanitizeExternalOrRelativeUrl(payload.url) || "#";
  const status = payload.isActive ?? true ? 1 : 0;

  if (payload.id && payload.id > 0) {
    const existing = await getFooterResourceLinkById(payload.id);
    if (!existing) throw new Error("Resource link not found.");
    const displayOrder = payload.displayOrder ?? existing.displayOrder;

    await pool.execute(
      `UPDATE footer_resource_links
       SET title = ?, slug = ?, url = ?, display_order = ?, status = ?
       WHERE id = ?`,
      [title, slug, url, displayOrder, status, payload.id],
    );

    const updated = await getFooterResourceLinkById(payload.id);
    if (!updated) throw new Error("Failed to retrieve updated resource link.");
    return updated;
  }

  let nextOrder = payload.displayOrder;
  if (nextOrder === undefined || nextOrder === null) {
    const maxRows = await queryRows<RowDataPacket & { maxOrder: number | null }>(
      "SELECT MAX(display_order) as maxOrder FROM footer_resource_links",
    );
    nextOrder = (maxRows[0]?.maxOrder ?? 0) + 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO footer_resource_links (title, slug, url, display_order, status)
     VALUES (?, ?, ?, ?, ?)`,
    [title, slug, url, nextOrder, status],
  );

  const created = await getFooterResourceLinkById(result.insertId);
  if (!created) throw new Error("Failed to retrieve created resource link.");
  return created;
}

export async function updateFooterResourceLinksDisplayOrder(
  items: FooterResourceLinkDisplayOrderItem[],
): Promise<void> {
  await ensureFooterResourceLinksTable();
  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    for (const item of items) {
      await connection.execute(
        "UPDATE footer_resource_links SET display_order = ? WHERE id = ?",
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

export async function deleteFooterResourceLink(id: number): Promise<boolean> {
  await ensureFooterResourceLinksTable();
  const pool = getMysqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM footer_resource_links WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}
