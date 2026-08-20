import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { hasMeaningfulHtml } from "@/src/lib/html-content";
import {
  sanitizeNullablePlainText,
  sanitizeRichHtml,
  sanitizePlainText,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type { BlogListPayload, BlogRow, BlogStatus, ListData, BlogUpsertPayload } from "@/src/types/admin-api";

type BlogDbRow = RowDataPacket & {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  content: string;
  filepath: string | null;
  status: BlogStatus;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapBlogRow(row: BlogDbRow): BlogRow {
  return {
    id: row.id,
    title: sanitizePlainText(row.title),
    slug: sanitizePlainText(row.slug),
    shortDescription: sanitizeNullablePlainText(row.short_description),
    content: sanitizeRichHtml(row.content),
    filepath: sanitizeNullablePlainText(row.filepath),
    status: row.status,
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function normalizeRequiredString(value: string | null | undefined, label: string) {
  const normalized = value?.trim() ?? "";
  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

function normalizeStatus(value?: BlogStatus | null) {
  return value === "published" ? "published" : "draft";
}

export async function listBlogs(payload: BlogListPayload): Promise<ListData<BlogRow>> {
  const conditions = ["is_active = 1"];
  const params: Array<string | number> = [];

  if (payload.status) {
    conditions.push("status = ?");
    params.push(payload.status);
  }

  const search = payload.search?.trim();
  if (search) {
    const like = `%${search}%`;
    conditions.push("(title LIKE ? OR slug LIKE ? OR short_description LIKE ? OR content LIKE ?)");
    params.push(like, like, like, like);
  }

  const rows = await queryRows<BlogDbRow>(
    `SELECT id, title, slug, short_description, content, filepath, status, is_active, created_at, updated_at
     FROM blog_posts
     WHERE ${conditions.join(" AND ")}
     ORDER BY updated_at DESC, id DESC`,
    params,
  );

  return {
    result: rows.map(mapBlogRow),
    count: rows.length,
  };
}

export async function getBlogById(id: number) {
  const rows = await queryRows<BlogDbRow>(
    `SELECT id, title, slug, short_description, content, filepath, status, is_active, created_at, updated_at
     FROM blog_posts
     WHERE id = ? AND is_active = 1`,
    [id],
  );

  const row = rows[0];
  return row ? mapBlogRow(row) : null;
}

export async function listPublishedBlogs() {
  const rows = await queryRows<BlogDbRow>(
    `SELECT id, title, slug, short_description, content, filepath, status, is_active, created_at, updated_at
     FROM blog_posts
     WHERE is_active = 1 AND status = 'published'
     ORDER BY updated_at DESC, id DESC`,
  );

  return rows.map(mapBlogRow);
}

export async function getPublishedBlogBySlug(slug: string) {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const rows = await queryRows<BlogDbRow>(
    `SELECT id, title, slug, short_description, content, filepath, status, is_active, created_at, updated_at
     FROM blog_posts
     WHERE slug = ? AND is_active = 1 AND status = 'published'
     LIMIT 1`,
    [normalizedSlug],
  );

  const row = rows[0];
  return row ? mapBlogRow(row) : null;
}

export async function upsertBlog(payload: BlogUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    const title = sanitizePlainText(normalizeRequiredString(payload.title, "Title"));
    const slug = sanitizePlainText(normalizeRequiredString(payload.slug, "Slug"));
    const content = sanitizeRichHtml(normalizeRequiredString(payload.content, "Content"));
    const shortDescription = sanitizeNullablePlainText(payload.shortDescription);
    const filepath = sanitizeNullablePlainText(payload.filepath);
    const status = normalizeStatus(payload.status);
    const requestedId = Number(payload.id ?? 0);

    if (!hasMeaningfulHtml(content)) {
      throw new Error("Content is required.");
    }

    if (requestedId > 0) {
      const [existingRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM blog_posts WHERE id = ? AND is_active = 1`,
        [requestedId],
      );

      if (!existingRows[0]) {
        throw new Error("Blog post not found.");
      }

      const [duplicateRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM blog_posts WHERE slug = ? AND id <> ? AND is_active = 1`,
        [slug, requestedId],
      );

      if (duplicateRows[0]) {
        throw new Error("Slug must be unique.");
      }

      await connection.execute<ResultSetHeader>(
        `UPDATE blog_posts
         SET title = ?, slug = ?, short_description = ?, content = ?, filepath = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title, slug, shortDescription, content, filepath, status, requestedId],
      );

      await connection.commit();
      return { id: requestedId, action: "updated" as const };
    }

    const [duplicateRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
      `SELECT id FROM blog_posts WHERE slug = ? AND is_active = 1`,
      [slug],
    );

    if (duplicateRows[0]) {
      throw new Error("Slug must be unique.");
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO blog_posts (title, slug, short_description, content, filepath, status, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [title, slug, shortDescription, content, filepath, status],
    );

    await connection.commit();
    return { id: Number(result.insertId), action: "created" as const };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateBlogFilePath(id: number, filepath: string | null) {
  const sanitizedFilePath = sanitizeNullablePlainText(filepath);

  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE blog_posts
     SET filepath = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [sanitizedFilePath, id],
  );

  if (result.affectedRows <= 0) {
    throw new Error("Blog post not found.");
  }
}

export async function deleteBlog(id: number) {
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE blog_posts
     SET is_active = 0, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [id],
  );

  return result.affectedRows > 0;
}
