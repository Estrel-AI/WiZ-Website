import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type { PageSectionRow, PageSectionsOrderPayload } from "@/src/types/admin-api";

type PageSectionDbRow = RowDataPacket & {
  id: number;
  page_key: string;
  section_key: string;
  display_order: number;
  is_active: number;
  created_at: Date | string;
  updated_at: Date | string;
};

const DEFAULT_PAGE_SECTIONS: Record<string, string[]> = {
  ABOUT: ["VISION", "MISSIONS", "LEADERSHIP", "PRODUCT"],
  HOME: [
    "HERO",
    "TRUSTED_BY",
    "FEATURES",
    "USE_CASES",
    "AI_ADOPTION",
    "OPERATIONALIZE",
    "TESTIMONIALS",
    "FAQS",
    "CTA",
  ],
  PARTNER: ["BANNER", "PATHWAY", "BENEFITS", "FORM", "FIND_PARTNER"],
  PRICING: ["PLANS", "ADDONS", "CTA"],
};

const FALLBACK_PAGE_SECTIONS: Record<string, string[]> = {
  ABOUT: ["VISION", "MISSIONS", "LEADERSHIP", "PRODUCT"],
  HOME: [
    "HERO",
    "TRUSTED_BY",
    "FEATURES",
    "USE_CASES",
    "AI_ADOPTION",
    "OPERATIONALIZE",
    "TESTIMONIALS",
    "FAQS",
    "CTA",
  ],
  PARTNER: ["BANNER", "PATHWAY", "BENEFITS", "FORM", "FIND_PARTNER"],
  PRICING: ["PLANS", "ADDONS", "CTA"],
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function mapPageSectionRow(row: PageSectionDbRow): PageSectionRow {
  return {
    id: row.id,
    pageKey: row.page_key,
    sectionKey: row.section_key,
    displayOrder: row.display_order,
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export function getDefaultPageSectionKeys(pageKey: string): string[] {
  return DEFAULT_PAGE_SECTIONS[pageKey] ? [...DEFAULT_PAGE_SECTIONS[pageKey]] : [];
}

export async function ensurePageSectionsTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS page_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      page_key VARCHAR(50) NOT NULL,
      section_key VARCHAR(50) NOT NULL,
      display_order INT NOT NULL DEFAULT 1,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_page_section (page_key, section_key),
      INDEX idx_page_section_order (page_key, display_order),
      INDEX idx_page_section_active (page_key, is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

export async function seedDefaultPageSections(pageKey: string): Promise<void> {
  const defaults = DEFAULT_PAGE_SECTIONS[pageKey];
  if (!defaults || !defaults.length) return;

  const pool = getMysqlPool();
  for (let index = 0; index < defaults.length; index++) {
    await pool.execute(
      `INSERT INTO page_sections (page_key, section_key, display_order, is_active)
       SELECT ?, ?, ?, 1
       FROM DUAL
       WHERE NOT EXISTS (
         SELECT 1 FROM page_sections WHERE page_key = ? AND section_key = ?
       )`,
      [pageKey, defaults[index], index + 1, pageKey, defaults[index]],
    );
  }
}

export async function listPageSections(pageKey: string): Promise<PageSectionRow[]> {
  await ensurePageSectionsTable();
  await seedDefaultPageSections(pageKey);

  const rows = await queryRows<PageSectionDbRow>(
    `SELECT id, page_key, section_key, display_order, is_active, created_at, updated_at
     FROM page_sections
     WHERE page_key = ?
     ORDER BY display_order ASC, id ASC`,
    [pageKey],
  );

  return rows.map(mapPageSectionRow);
}

export async function listPageSectionKeys(pageKey: string): Promise<string[]> {
  const rows = await listPageSections(pageKey);
  return rows.filter((row) => row.isActive).map((row) => row.sectionKey);
}

export async function updatePageSectionsDisplayOrder(
  payload: PageSectionsOrderPayload,
): Promise<number> {
  const pageKey = payload.pageKey?.trim();
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!pageKey || !items.length) return 0;

  await ensurePageSectionsTable();

  const connection = await getMysqlPool().getConnection();
  try {
    await connection.beginTransaction();

    for (const item of items) {
      const sectionKey = item.sectionKey?.trim();
      if (!sectionKey || typeof item.displayOrder !== "number") {
        throw new Error("Each item must have a sectionKey and a numeric displayOrder.");
      }
      await connection.execute<ResultSetHeader>(
        `INSERT INTO page_sections (page_key, section_key, display_order, is_active)
         VALUES (?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           display_order = ?,
           is_active = 1,
           updated_at = CURRENT_TIMESTAMP`,
        [pageKey, sectionKey, item.displayOrder, item.displayOrder],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return items.length;
}

export function getFallbackPageSectionKeys(pageKey: string): string[] {
  return FALLBACK_PAGE_SECTIONS[pageKey] ? [...FALLBACK_PAGE_SECTIONS[pageKey]] : [];
}