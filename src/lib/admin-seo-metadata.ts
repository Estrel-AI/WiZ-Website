import type { RowDataPacket } from "mysql2/promise";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type { SeoMetadataRow, SeoMetadataUpsertPayload } from "@/src/types/admin-api";

export type SeoMetadataDbRow = RowDataPacket & {
  id: number;
  page_key: string;
  page_name: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  created_at: Date | string;
  updated_at: Date | string;
};

function mapSeoRow(row: SeoMetadataDbRow): SeoMetadataRow {
  return {
    id: row.id,
    pageKey: row.page_key,
    pageName: row.page_name,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    keywords: row.keywords,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

const DEFAULT_SEO_RECORDS: Array<Omit<SeoMetadataRow, "id" | "createdAt" | "updatedAt">> = [
  {
    pageKey: "home",
    pageName: "Home Page",
    metaTitle: "WiiZ | Enterprise AI Orchestration & Governance Platform",
    metaDescription:
      "WiiZ is the enterprise platform for AI orchestration, governance, and agent-based automation. Build, deploy, and govern agentic AI at scale.",
    keywords: "AI Orchestration, Agentic AI, Enterprise Automation, WiiZ Platform, AI Governance, AI Workforce",
  },
  {
    pageKey: "about",
    pageName: "About Us",
    metaTitle: "About WiiZ | Enterprise AI Workforce Operating System",
    metaDescription:
      "Discover the WiiZ story, our leadership team, vision, and mission to build the enterprise operating system for agentic AI.",
    keywords: "About WiiZ, Estrel AI, Enterprise AI Team, AI Vision, AI Leadership",
  },
  {
    pageKey: "partner",
    pageName: "Partner Program",
    metaTitle: "Partner with WiiZ | Enterprise Agentic AI Partner Program",
    metaDescription:
      "Join the WiiZ Partner Program. Collaborate on enterprise Agentic AI solutions, expand offerings, and deliver state-of-the-art AI with governance.",
    keywords: "WiiZ Partner Program, AI Ecosystem, Agentic AI Partners, Enterprise AI Solutions",
  },
  {
    pageKey: "ai-agents",
    pageName: "AI Agents",
    metaTitle: "Pre-Built Enterprise AI Agents | WiiZ",
    metaDescription:
      "Explore industries, business functions, and practical AI use cases designed to turn high-value workflows into clear implementation paths.",
    keywords: "Pre-Built AI Agents, Enterprise Workflows, AI Use Cases, Business Automation, Intent Studio",
  },
  {
    pageKey: "pricing",
    pageName: "Pricing & Plans",
    metaTitle: "Pricing & Plans | WiiZ Platform",
    metaDescription:
      "Explore transparent pricing plans for enterprise AI orchestration, credits, Intent Studio, and EvalOps governance tooling.",
    keywords: "WiiZ Pricing, AI Orchestration Plans, Enterprise AI Credits, AI Governance Pricing",
  },
  {
    pageKey: "blog",
    pageName: "Blog & Insights",
    metaTitle: "WiiZ Blog | Insights on Agentic AI & Enterprise Automation",
    metaDescription:
      "Read the latest articles, engineering updates, and practical AI stories from the WiiZ team.",
    keywords: "AI Blog, Agentic AI Insights, Tech News, Enterprise Automation, WiiZ Blog",
  },
  {
    pageKey: "contact",
    pageName: "Contact Us",
    metaTitle: "Contact WiiZ | Get in Touch with Our AI Experts",
    metaDescription:
      "Have questions about WiiZ platform, enterprise deployment, or partnerships? Contact our team of AI experts today.",
    keywords: "Contact WiiZ, AI Consultation, Support, Enterprise Sales, Estrel AI",
  },
  {
    pageKey: "global",
    pageName: "Global Website Default",
    metaTitle: "WiiZ | Enterprise AI Orchestration & Governance",
    metaDescription:
      "WiiZ is the enterprise platform for AI orchestration, governance, and agent-based automation.",
    keywords: "WiiZ, AI Orchestration, Agentic AI, Enterprise Governance",
  },
];

export async function ensureSeoMetadataTable() {
  const pool = getMysqlPool();

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS site_seo_metadata (
      id INT AUTO_INCREMENT PRIMARY KEY,
      page_key VARCHAR(100) NOT NULL UNIQUE,
      page_name VARCHAR(100) NOT NULL,
      meta_title VARCHAR(255) NOT NULL,
      meta_description TEXT NOT NULL,
      keywords TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.execute(`
    DELETE t1 FROM site_seo_metadata t1
    INNER JOIN site_seo_metadata t2
    ON t1.page_key = t2.page_key AND t1.id > t2.id;
  `);

  for (const item of DEFAULT_SEO_RECORDS) {
    await pool.execute(
      `INSERT INTO site_seo_metadata (page_key, page_name, meta_title, meta_description, keywords)
       SELECT ?, ?, ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM site_seo_metadata WHERE page_key = ?
       )`,
      [
        item.pageKey,
        item.pageName,
        item.metaTitle,
        item.metaDescription,
        item.keywords,
        item.pageKey,
      ],
    );
  }
}

export async function getAllSeoMetadataAdmin(): Promise<SeoMetadataRow[]> {
  await ensureSeoMetadataTable();
  const rows = await queryRows<SeoMetadataDbRow>(
    "SELECT * FROM site_seo_metadata ORDER BY id ASC",
  );
  return rows.map(mapSeoRow);
}

export async function getSeoMetadataByPageKey(pageKey: string): Promise<SeoMetadataRow | null> {
  await ensureSeoMetadataTable();
  const rows = await queryRows<SeoMetadataDbRow>(
    "SELECT * FROM site_seo_metadata WHERE page_key = ? LIMIT 1",
    [pageKey.toLowerCase().trim()],
  );
  return rows[0] ? mapSeoRow(rows[0]) : null;
}

export async function upsertSeoMetadata(payload: SeoMetadataUpsertPayload): Promise<SeoMetadataRow> {
  await ensureSeoMetadataTable();
  const pool = getMysqlPool();

  const pageKey = payload.pageKey.toLowerCase().trim();
  const pageName = payload.pageName.trim();
  const metaTitle = payload.metaTitle.trim();
  const metaDescription = payload.metaDescription.trim();
  const keywords = payload.keywords.trim();

  if (payload.id && payload.id > 0) {
    await pool.execute(
      `UPDATE site_seo_metadata
       SET page_name = ?, meta_title = ?, meta_description = ?, keywords = ?
       WHERE id = ?`,
      [pageName, metaTitle, metaDescription, keywords, payload.id],
    );
  } else {
    await pool.execute(
      `INSERT INTO site_seo_metadata (page_key, page_name, meta_title, meta_description, keywords)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         page_name = VALUES(page_name),
         meta_title = VALUES(meta_title),
         meta_description = VALUES(meta_description),
         keywords = VALUES(keywords)`,
      [pageKey, pageName, metaTitle, metaDescription, keywords],
    );
  }

  const updated = await getSeoMetadataByPageKey(pageKey);
  if (!updated) {
    throw new Error("Failed to retrieve saved SEO metadata.");
  }
  return updated;
}
