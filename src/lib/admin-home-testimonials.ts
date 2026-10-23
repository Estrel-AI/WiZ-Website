import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  sanitizeExternalOrRelativeUrl,
  sanitizeNullablePlainText,
  sanitizePlainText,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  HomeTestimonialDisplayOrderPayload,
  HomeTestimonialListPayload,
  HomeTestimonialRow,
  HomeTestimonialUpsertPayload,
  ListData,
} from "@/src/types/admin-api";

type TestimonialDbRow = RowDataPacket & {
  id: number;
  name: string;
  role: string;
  image: string | null;
  quote: string;
  display_order: number;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapTestimonialRow(row: TestimonialDbRow): HomeTestimonialRow {
  return {
    id: row.id,
    name: sanitizePlainText(row.name),
    role: sanitizePlainText(row.role),
    image: sanitizeExternalOrRelativeUrl(row.image),
    quote: sanitizePlainText(row.quote),
    displayOrder: Number(row.display_order ?? 0),
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export const DEFAULT_TESTIMONIALS = [
  {
    name: "Sai Shruthi",
    role: "Agentic AI Developer",
    image: null,
    quote:
      "WiiZ has been instrumental in bridging the gap between AI capabilities and business applications. It supports practical implementation, making it easier to deliver scalable and impactful solutions.",
    displayOrder: 1,
  },
  {
    name: "Paarth",
    role: "AI Engineer",
    image: null,
    quote:
      "Using WiiZ has significantly improved the way I build and manage AI workflows. The platform is intuitive yet powerful, reducing manual effort and accelerating workflow development.",
    displayOrder: 2,
  },
  {
    name: "Gowtham Sai",
    role: "AI Engineer",
    image: null,
    quote:
      "WiiZ redefines the integration of automation and AI through a highly intuitive and scalable platform. It transformed complex concepts into efficient real-world workflows with speed and flexibility.",
    displayOrder: 3,
  },
  {
    name: "Aravind",
    role: "Software Engineer",
    image: null,
    quote:
      "WiiZ transforms the complexity of AI orchestration into an intuitive, streamlined process. It has been a significant catalyst in advancing my technical expertise and understanding of enterprise AI efficiency.",
    displayOrder: 4,
  },
  {
    name: "Ankur",
    role: "AI Engineer",
    image: null,
    quote:
      "WiiZ is a strong platform for building AI workflows in a clear and structured way. It simplifies complex automation while still allowing full control over how systems are designed.",
    displayOrder: 5,
  },
];

export async function ensureHomeTestimonialsTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS home_testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      image VARCHAR(500),
      quote TEXT NOT NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Clean up legacy ui-avatars URLs so avatars render cleanly
  await pool.execute(
    `UPDATE home_testimonials SET image = NULL WHERE image LIKE '%ui-avatars.com%'`,
  );

  const [existing] = await pool.query<Array<RowDataPacket & { cnt: number }>>(
    `SELECT COUNT(*) AS cnt FROM home_testimonials WHERE is_active = 1`,
  );

  if (!existing[0] || existing[0].cnt === 0) {
    for (const item of DEFAULT_TESTIMONIALS) {
      await pool.execute(
        `INSERT INTO home_testimonials (name, role, image, quote, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [item.name, item.role, item.image, item.quote, item.displayOrder],
      );
    }
  }
}

export async function listHomeTestimonials(
  payload: HomeTestimonialListPayload,
): Promise<ListData<HomeTestimonialRow>> {
  await ensureHomeTestimonialsTable();
  const conditions: string[] = [];
  const params: Array<string | number> = [];
  const search = payload.search?.trim();

  if (typeof payload.isActive === "boolean") {
    conditions.push("is_active = ?");
    params.push(payload.isActive ? 1 : 0);
  }

  if (search) {
    const like = `%${search}%`;
    conditions.push("(name LIKE ? OR role LIKE ? OR quote LIKE ?)");
    params.push(like, like, like);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await queryRows<TestimonialDbRow>(
    `SELECT id, name, role, image, quote, display_order, is_active, created_at, updated_at
     FROM home_testimonials
     ${whereClause}
     ORDER BY display_order ASC, created_at DESC`,
    params,
  );

  return {
    result: rows.map(mapTestimonialRow),
    count: rows.length,
  };
}

export async function getHomeTestimonialById(id: number) {
  await ensureHomeTestimonialsTable();
  const rows = await queryRows<TestimonialDbRow>(
    `SELECT id, name, role, image, quote, display_order, is_active, created_at, updated_at
     FROM home_testimonials
     WHERE id = ?`,
    [id],
  );

  return rows[0] ? mapTestimonialRow(rows[0]) : null;
}

function normalizePayload(payload: HomeTestimonialUpsertPayload) {
  const name = sanitizePlainText(payload.name);
  const role = sanitizePlainText(payload.role);
  const image = sanitizeExternalOrRelativeUrl(payload.image);
  const quote = sanitizePlainText(payload.quote);
  const displayOrder = Number(payload.displayOrder ?? 0);
  const isActive = payload.isActive ?? true;

  if (!name) throw new Error("Name is required.");
  if (name.length > 20) throw new Error("Name must be 20 characters or less.");
  if (!role) throw new Error("Role is required.");
  if (role.length > 20) throw new Error("Role must be 20 characters or less.");
  if (!quote) throw new Error("Quote is required.");
  if (quote.length > 250) throw new Error("Quote must be 250 characters or less.");

  return { name, role, image, quote, displayOrder, isActive };
}

export async function upsertHomeTestimonial(payload: HomeTestimonialUpsertPayload) {
  await ensureHomeTestimonialsTable();
  const normalized = normalizePayload(payload);
  const requestedId = Number(payload.id ?? 0);
  const pool = getMysqlPool();

  if (requestedId > 0) {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE home_testimonials
       SET name = ?, role = ?, image = ?, quote = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        normalized.name,
        normalized.role,
        normalized.image,
        normalized.quote,
        normalized.displayOrder,
        normalized.isActive ? 1 : 0,
        requestedId,
      ],
    );

    if (result.affectedRows === 0) {
      throw new Error("Testimonial not found.");
    }

    return { id: requestedId, action: "updated" as const };
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO home_testimonials (name, role, image, quote, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      normalized.name,
      normalized.role,
      normalized.image,
      normalized.quote,
      normalized.displayOrder,
      normalized.isActive ? 1 : 0,
    ],
  );

  return { id: Number(result.insertId), action: "created" as const };
}

export async function deleteHomeTestimonial(id: number) {
  await ensureHomeTestimonialsTable();
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `DELETE FROM home_testimonials WHERE id = ?`,
    [id],
  );

  return result.affectedRows > 0;
}

export async function updateHomeTestimonialDisplayOrder(payload: HomeTestimonialDisplayOrderPayload) {
  await ensureHomeTestimonialsTable();
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) return { updatedCount: 0 };

  const pool = getMysqlPool();
  for (const item of items) {
    await pool.execute(
      `UPDATE home_testimonials SET display_order = ? WHERE id = ?`,
      [item.displayOrder, item.id],
    );
  }

  return { updatedCount: items.length };
}

export async function updateHomeTestimonialImage(id: number, imagePath: string) {
  await ensureHomeTestimonialsTable();
  const pool = getMysqlPool();
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE home_testimonials SET image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [imagePath, id],
  );
  if (result.affectedRows === 0) {
    throw new Error("Testimonial not found.");
  }
  return { id, imagePath };
}
