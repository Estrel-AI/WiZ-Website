import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizeExternalOrRelativeUrl, sanitizePlainText } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  HomeAiAdoptionCardDisplayOrderItem,
  HomeAiAdoptionCardRow,
  HomeAiAdoptionCardUpsertPayload,
} from "@/src/types/admin-api";

type HomeAiAdoptionCardDbRow = RowDataPacket & {
  id: number;
  title: string;
  description: string;
  image: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  status: number;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapAiAdoptionRow(row: HomeAiAdoptionCardDbRow): HomeAiAdoptionCardRow {
  return {
    id: row.id,
    title: sanitizePlainText(row.title),
    description: sanitizePlainText(row.description),
    image: row.image,
    ctaText: sanitizePlainText(row.cta_text),
    ctaUrl: sanitizeExternalOrRelativeUrl(row.cta_url) ?? "/contact",
    displayOrder: row.display_order,
    isActive: Boolean(row.status),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const DEFAULT_AI_ADOPTION_CARDS = [
  {
    title: "Business & Operations Leaders",
    description: "Empower business teams to automate high-value workflows with clarity, speed, and operational visibility.",
    image: "/api/assets/dummy_image/business_leaders.jpg",
    ctaText: "Book an Appointment",
    ctaUrl: "/contact",
    displayOrder: 1,
  },
  {
    title: "Enterprise IT & AI Governance",
    description: "Maintain centralized control, governance, security, and compliance across enterprise AI operations.",
    image: "/api/assets/dummy_image/Enterprice_it.jpg",
    ctaText: "Book an Appointment",
    ctaUrl: "/contact",
    displayOrder: 2,
  },
  {
    title: "System Integrators & Partners",
    description: "Deliver enterprise AI transformation faster with a unified orchestration and governance platform.",
    image: "/api/assets/dummy_image/system_integrator.jpg",
    ctaText: "Partner with Us",
    ctaUrl: "/partner",
    displayOrder: 3,
  },
  {
    title: "Legacy Product Enhancement",
    description: "Enhance your existing platforms with ease using the Embedded WiiZ Platform.",
    image: "/api/assets/dummy_image/Ai_Team.jpg",
    ctaText: "Partner with Us",
    ctaUrl: "/partner",
    displayOrder: 4,
  },
];

export async function ensureHomeAiAdoptionCardsTable() {
  const pool = getMysqlPool();

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS home_ai_adoption_cards (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(500) NOT NULL,
      cta_text VARCHAR(100) NOT NULL DEFAULT 'Book an Appointment',
      cta_url VARCHAR(500) NOT NULL DEFAULT '/contact',
      display_order INT NOT NULL DEFAULT 0,
      status TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await pool.execute(`
    DELETE t1 FROM home_ai_adoption_cards t1
    INNER JOIN home_ai_adoption_cards t2
    ON t1.title = t2.title AND t1.id > t2.id;
  `);

  for (const card of DEFAULT_AI_ADOPTION_CARDS) {
    await pool.execute(
      `INSERT INTO home_ai_adoption_cards (title, description, image, cta_text, cta_url, display_order, status)
       SELECT ?, ?, ?, ?, ?, ?, 1
       WHERE NOT EXISTS (
         SELECT 1 FROM home_ai_adoption_cards WHERE title = ?
       )`,
      [
        card.title,
        card.description,
        card.image,
        card.ctaText,
        card.ctaUrl,
        card.displayOrder,
        card.title,
      ],
    );
  }
}

export async function getAllHomeAiAdoptionCardsAdmin(): Promise<HomeAiAdoptionCardRow[]> {
  await ensureHomeAiAdoptionCardsTable();
  const rows = await queryRows<HomeAiAdoptionCardDbRow>(
    "SELECT * FROM home_ai_adoption_cards ORDER BY display_order ASC, id ASC",
  );
  return rows.map(mapAiAdoptionRow);
}

export async function getActiveHomeAiAdoptionCards(): Promise<HomeAiAdoptionCardRow[]> {
  await ensureHomeAiAdoptionCardsTable();
  const rows = await queryRows<HomeAiAdoptionCardDbRow>(
    "SELECT * FROM home_ai_adoption_cards WHERE status = 1 ORDER BY display_order ASC, id ASC",
  );
  return rows.map(mapAiAdoptionRow);
}

export async function getHomeAiAdoptionCardById(id: number): Promise<HomeAiAdoptionCardRow | null> {
  await ensureHomeAiAdoptionCardsTable();
  const rows = await queryRows<HomeAiAdoptionCardDbRow>(
    "SELECT * FROM home_ai_adoption_cards WHERE id = ? LIMIT 1",
    [id],
  );
  return rows[0] ? mapAiAdoptionRow(rows[0]) : null;
}

export async function upsertHomeAiAdoptionCard(payload: HomeAiAdoptionCardUpsertPayload): Promise<HomeAiAdoptionCardRow> {
  await ensureHomeAiAdoptionCardsTable();
  const pool = getMysqlPool();

  const title = sanitizePlainText(payload.title);
  const description = sanitizePlainText(payload.description);
  const image = payload.image;
  const ctaText = sanitizePlainText(payload.ctaText || "Book an Appointment");
  const ctaUrl = sanitizeExternalOrRelativeUrl(payload.ctaUrl || "/contact");
  const isActive = payload.isActive !== undefined ? (payload.isActive ? 1 : 0) : 1;

  if (payload.id && payload.id > 0) {
    await pool.execute(
      `UPDATE home_ai_adoption_cards
       SET title = ?, description = ?, image = ?, cta_text = ?, cta_url = ?, status = ?
       WHERE id = ?`,
      [title, description, image, ctaText, ctaUrl, isActive, payload.id],
    );
    const updated = await getHomeAiAdoptionCardById(payload.id);
    if (!updated) throw new Error("Failed to retrieve updated card.");
    return updated;
  }

  const orderRows = await queryRows<RowDataPacket & { max_order: number | null }>(
    "SELECT MAX(display_order) as max_order FROM home_ai_adoption_cards",
  );
  const nextOrder = (orderRows[0]?.max_order ?? 0) + 1;
  const displayOrder = payload.displayOrder ?? nextOrder;

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO home_ai_adoption_cards (title, description, image, cta_text, cta_url, display_order, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, image, ctaText, ctaUrl, displayOrder, isActive],
  );

  const created = await getHomeAiAdoptionCardById(result.insertId);
  if (!created) throw new Error("Failed to retrieve newly created card.");
  return created;
}

export async function deleteHomeAiAdoptionCard(id: number): Promise<boolean> {
  await ensureHomeAiAdoptionCardsTable();
  const pool = getMysqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM home_ai_adoption_cards WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function updateHomeAiAdoptionCardsDisplayOrder(items: HomeAiAdoptionCardDisplayOrderItem[]): Promise<void> {
  await ensureHomeAiAdoptionCardsTable();
  const pool = getMysqlPool();

  for (const item of items) {
    await pool.execute(
      "UPDATE home_ai_adoption_cards SET display_order = ? WHERE id = ?",
      [item.displayOrder, item.id],
    );
  }
}
