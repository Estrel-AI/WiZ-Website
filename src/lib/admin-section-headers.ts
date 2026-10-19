import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  sanitizeExternalOrRelativeUrl,
  sanitizeNullablePlainText,
  sanitizePlainText,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  SectionHeaderData,
  SectionHeaderKey,
  SectionHeaderUpsertPayload,
} from "@/src/types/admin-api";

type SectionHeaderDbRow = RowDataPacket & {
  id: number;
  section_key: string;
  badge_text: string | null;
  heading: string;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  background_image: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapSectionHeader(row: SectionHeaderDbRow): SectionHeaderData {
  return {
    id: row.id,
    sectionKey: row.section_key as SectionHeaderKey,
    badgeText: sanitizeNullablePlainText(row.badge_text),
    heading: sanitizePlainText(row.heading),
    description: sanitizeNullablePlainText(row.description),
    buttonText: sanitizeNullablePlainText(row.button_text),
    buttonUrl: sanitizeExternalOrRelativeUrl(row.button_url),
    backgroundImage: sanitizeExternalOrRelativeUrl(row.background_image),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export const DEFAULT_SECTION_HEADERS: Record<string, SectionHeaderUpsertPayload> = {
  FEATURE: {
    sectionKey: "FEATURE",
    badgeText: "FEATURES",
    heading: "Everything you need to move from prototype to production",
    description: "WiiZ brings together the core capabilities required to Orchestrate enterprise AI agents at scale.",
    buttonText: null,
    buttonUrl: null,
  },
  USE_CASE: {
    sectionKey: "USE_CASE",
    badgeText: "USE CASES",
    heading: "Leaderboard of WiiZ Built AI Agents",
    description: "Examples of AI agents built on WiiZ for real enterprise workflows.",
    buttonText: "View All Agents",
    buttonUrl: "/ai-agents",
  },
  TRUSTED_BY: {
    sectionKey: "TRUSTED_BY",
    badgeText: "TRUSTED BY LEADING ENTERPRISES",
    heading: "Trusted by Innovators Worldwide",
    description: "Empowering teams across industries to orchestrate AI with confidence.",
    buttonText: null,
    buttonUrl: null,
  },
  TESTIMONIAL: {
    sectionKey: "TESTIMONIAL",
    badgeText: "TESTIMONIALS",
    heading: "Loved by Engineering & AI Leaders",
    description: "See how teams accelerate their AI journey with WiiZ platform.",
    buttonText: null,
    buttonUrl: null,
  },
  FAQ: {
    sectionKey: "FAQ",
    badgeText: "FAQ",
    heading: "Frequently Asked Questions",
    description: "Everything you need to know about WiiZ AI orchestration and deployment.",
    buttonText: "Contact Support",
    buttonUrl: "/contact",
  },
  PARTNER_BENEFITS: {
    sectionKey: "PARTNER_BENEFITS",
    badgeText: "PARTNERSHIP",
    heading: "Grow Your Business with WiiZ Ecosystem",
    description: "Join our partner network to deliver state-of-the-art AI solutions.",
    buttonText: "Become a Partner",
    buttonUrl: "/partner",
  },
  HOW_IT_WORKS: {
    sectionKey: "HOW_IT_WORKS",
    badgeText: "HOW IT WORKS",
    heading: "Simple Steps to Deploy Agentic AI",
    description: "Design, integrate, monitor, and scale enterprise agents in minutes.",
    buttonText: "Explore Platform",
    buttonUrl: "/features",
  },
  BLOG: {
    sectionKey: "BLOG",
    badgeText: "Blog",
    heading: "Ideas, product notes, and practical AI stories from the WiiZ team.",
    description: "Explore published posts from the admin panel in a website experience that matches the rest of the product theme.",
    buttonText: null,
    buttonUrl: null,
  },
  VISION: {
    sectionKey: "VISION",
    badgeText: "OUR VISION",
    heading: "The Enterprise AI Workforce Needs an Operating System",
    description: "We believe every enterprise will enhance itself with AI. WiiZ is building the operating system that enables enterprises to adopt AI at ease.",
    buttonText: null,
    buttonUrl: "/api/assets/dummy_image/about_section.png",
    backgroundImage: null,
  },
  PARTNER_HEADER: {
    sectionKey: "PARTNER_HEADER",
    badgeText: null,
    heading: "Become a Partner",
    description: "Partner with us and empower your customers by supporting them in simplifying their AI journey and how they can leverage Agentic AI with Governance and Orchestration.",
    buttonText: JSON.stringify({
      primaryText: "Explore and Apply",
      primaryUrl: "#pathway",
      secondaryText: "Find a Partner",
      secondaryUrl: "#find-partner",
    }),
    buttonUrl: "/api/assets/dummy_image/partners-banner-img.jpg",
    backgroundImage: null,
  },
  PARTNER_PATHWAYS: {
    sectionKey: "PARTNER_PATHWAYS",
    badgeText: null,
    heading: "Find Your Partnership Pathway",
    description: "We offer distinct partnership models designed to align with your business goals.",
    buttonText: null,
    buttonUrl: null,
  },
  AI_AGENTS_HEADER: {
    sectionKey: "AI_AGENTS_HEADER",
    badgeText: null,
    heading: "Pre-Built Enterprise AI Agents",
    description: "Explore industries, business functions, and practical AI use cases designed to turn high-value workflows into clear implementation paths.",
    buttonText: "Explore Pre-Built Enterprise AI Agents by Industry",
    buttonUrl: "Explore use cases by industries, business functions, and practical AI use cases designed to turn high-value workflows into clear implementation paths.",
  },
  AI_ADOPTION_HEADER: {
    sectionKey: "AI_ADOPTION_HEADER",
    badgeText: null,
    heading: "Accelerating Enterprise AI Adoption",
    description: "Empowering business teams, IT governance, system integrators, and product leaders to deploy agentic AI seamlessly.",
    buttonText: null,
    buttonUrl: null,
  },
};

export async function ensureSectionHeadersTable() {
  const pool = getMysqlPool();

  // Drop obsolete legacy single-purpose header tables
  try {
    await pool.execute(`DROP TABLE IF EXISTS home_use_case_header;`);
    await pool.execute(`DROP TABLE IF EXISTS home_feature_header;`);
  } catch (error) {
    console.warn("Notice dropping legacy header tables:", error);
  }

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS section_headers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(50) NOT NULL UNIQUE,
      badge_text VARCHAR(128),
      heading VARCHAR(255) NOT NULL,
      description TEXT,
      button_text VARCHAR(128),
      button_url VARCHAR(500),
      background_image VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_section_key (section_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  try {
    await pool.execute(`ALTER TABLE section_headers ADD COLUMN IF NOT EXISTS background_image VARCHAR(500) AFTER button_url`);
  } catch {
    // Column already exists or ALTER TABLE IF NOT ADD COLUMN not supported – safe to ignore
  }

  // Widen legacy VARCHAR(50) columns so longer badge / button text values are not truncated.
  const textColumns = await queryRows<
    RowDataPacket & { COLUMN_NAME: string; CHARACTER_MAXIMUM_LENGTH: number | null }
  >(
    `SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'section_headers'
       AND COLUMN_NAME IN ('badge_text', 'button_text')`,
  );
  for (const column of textColumns) {
    if (column.CHARACTER_MAXIMUM_LENGTH === null || column.CHARACTER_MAXIMUM_LENGTH < 128) {
      try {
        await pool.execute(`ALTER TABLE section_headers MODIFY ${column.COLUMN_NAME} VARCHAR(128)`);
      } catch {
        // Safe to ignore – column will remain VARCHAR if the ALTER is unsupported.
      }
    }
  }

  for (const [key, defaultVal] of Object.entries(DEFAULT_SECTION_HEADERS)) {
    const rows = await queryRows<SectionHeaderDbRow>(
      `SELECT id FROM section_headers WHERE section_key = ?`,
      [key],
    );
    if (!rows[0]) {
      await pool.execute(
        `INSERT INTO section_headers (section_key, badge_text, heading, description, button_text, button_url, background_image)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE heading = VALUES(heading)`,
        [key, defaultVal.badgeText ?? null, defaultVal.heading, defaultVal.description ?? null, defaultVal.buttonText ?? null, defaultVal.buttonUrl ?? null, defaultVal.backgroundImage ?? null],
      );
    }
  }
}

export async function getSectionHeader(key: string): Promise<SectionHeaderData | null> {
  const normalizedKey = key.trim().toUpperCase();
  await ensureSectionHeadersTable();
  const rows = await queryRows<SectionHeaderDbRow>(
    `SELECT id, section_key, badge_text, heading, description, button_text, button_url, background_image, created_at, updated_at
     FROM section_headers
     WHERE section_key = ?
     LIMIT 1`,
    [normalizedKey],
  );

  if (rows[0]) {
    return mapSectionHeader(rows[0]);
  }

  const fallback = DEFAULT_SECTION_HEADERS[normalizedKey];
  if (fallback) {
    return {
      id: 0,
      sectionKey: normalizedKey,
      badgeText: fallback.badgeText ?? null,
      heading: fallback.heading,
      description: fallback.description ?? null,
      buttonText: fallback.buttonText ?? null,
      buttonUrl: fallback.buttonUrl ?? null,
      backgroundImage: fallback.backgroundImage ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return null;
}

export async function listAllSectionHeaders(): Promise<SectionHeaderData[]> {
  await ensureSectionHeadersTable();
  const rows = await queryRows<SectionHeaderDbRow>(
    `SELECT id, section_key, badge_text, heading, description, button_text, button_url, background_image, created_at, updated_at
     FROM section_headers
     ORDER BY id ASC`,
  );
  return rows.map(mapSectionHeader);
}

function normalizeSectionHeaderPayload(key: string, payload: SectionHeaderUpsertPayload) {
  const normalizedKey = key.trim().toUpperCase();
  const heading = sanitizePlainText(payload.heading);
  const badgeText = sanitizeNullablePlainText(payload.badgeText);
  const description = sanitizeNullablePlainText(payload.description);
  const backgroundImage = sanitizeExternalOrRelativeUrl(payload.backgroundImage);

  const isPartnerHeader = normalizedKey === "PARTNER_HEADER";
  const isPartnerPathways = normalizedKey === "PARTNER_PATHWAYS";
  const isPartnerBenefits = normalizedKey === "PARTNER_BENEFITS";
  const isAiAgentsHeader = normalizedKey === "AI_AGENTS_HEADER";
  const isBlog = normalizedKey === "BLOG";

  const buttonText = isPartnerHeader
    ? parsePartnerHeaderButtons(payload.buttonText)
    : sanitizeNullablePlainText(payload.buttonText);
  const buttonUrl = isAiAgentsHeader
    ? sanitizeNullablePlainText(payload.buttonUrl)
    : sanitizeExternalOrRelativeUrl(payload.buttonUrl);

  if (!heading) throw new Error("Heading is required.");
  const maxHeading = isPartnerHeader ? 55 : isBlog ? 180 : 100;
  if (heading.length > maxHeading) throw new Error(`Heading must be ${maxHeading} characters or less.`);
  if (badgeText && badgeText.length > 80) throw new Error("Badge text must be 80 characters or less.");

  if (isAiAgentsHeader) {
    if (buttonText && buttonText.length > 100) throw new Error("Card heading must be 100 characters or less.");
    if (buttonUrl && buttonUrl.length > 300) throw new Error("Card description must be 300 characters or less.");
  } else if (!isPartnerHeader && buttonText && buttonText.length > 50) {
    throw new Error("Button text must be 50 characters or less.");
  }

  const maxDescription = isPartnerHeader
    ? 320
    : isPartnerPathways || isPartnerBenefits || isAiAgentsHeader || isBlog
      ? 250
      : 280;
  if (description && description.length > maxDescription) {
    throw new Error(`Description must be ${maxDescription} characters or less.`);
  }

  return {
    sectionKey: normalizedKey,
    badgeText,
    heading,
    description,
    buttonText,
    buttonUrl,
    backgroundImage,
  };
}

function parsePartnerHeaderButtons(value: string | null | undefined) {
  const raw = sanitizePlainText(value);
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid button configuration.");
  }

  const obj = parsed as {
    primaryText?: string;
    primaryUrl?: string;
    secondaryText?: string;
    secondaryUrl?: string;
  };
  const primaryText = sanitizePlainText(obj.primaryText ?? "");
  const secondaryText = sanitizePlainText(obj.secondaryText ?? "");
  if (primaryText.length > 50) throw new Error("Primary button text must be 50 characters or less.");
  if (secondaryText.length > 15) throw new Error("Secondary button text must be 15 characters or less.");

  return JSON.stringify({
    primaryText,
    primaryUrl: obj.primaryUrl ?? "",
    secondaryText,
    secondaryUrl: obj.secondaryUrl ?? "",
  });
}

export async function upsertSectionHeader(key: string, payload: SectionHeaderUpsertPayload) {
  await ensureSectionHeadersTable();
  const normalized = normalizeSectionHeaderPayload(key, payload);
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `INSERT INTO section_headers (section_key, badge_text, heading, description, button_text, button_url, background_image)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       badge_text = VALUES(badge_text),
       heading = VALUES(heading),
       description = VALUES(description),
       button_text = VALUES(button_text),
       button_url = VALUES(button_url),
       background_image = VALUES(background_image),
       updated_at = CURRENT_TIMESTAMP`,
    [
      normalized.sectionKey,
      normalized.badgeText,
      normalized.heading,
      normalized.description,
      normalized.buttonText,
      normalized.buttonUrl,
      normalized.backgroundImage,
    ],
  );

  return { id: Number(result.insertId) || 1, sectionKey: normalized.sectionKey, action: "updated" as const };
}
