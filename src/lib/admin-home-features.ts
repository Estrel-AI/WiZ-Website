import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  sanitizeExternalOrRelativeUrl,
  sanitizeNullablePlainText,
  sanitizePlainText,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  HomeFeatureDisplayOrderPayload,
  HomeFeatureListPayload,
  HomeFeatureMediaType,
  HomeFeatureRow,
  HomeFeatureUpsertPayload,
  ListData,
} from "@/src/types/admin-api";

type HomeFeatureDbRow = RowDataPacket & {
  id: number;
  label: string;
  title: string;
  description: string | null;
  features: string | string[] | null;
  media_type: HomeFeatureMediaType | null;
  media_url: string | null;
  display_order: number;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseFeatureList(value: HomeFeatureDbRow["features"]) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  return [];
}

function mapHomeFeatureRow(row: HomeFeatureDbRow): HomeFeatureRow {
  return {
    id: row.id,
    label: sanitizePlainText(row.label),
    title: sanitizePlainText(row.title),
    description: sanitizeNullablePlainText(row.description),
    features: parseFeatureList(row.features).map((item) => sanitizePlainText(item)).filter(Boolean),
    mediaType: row.media_type,
    mediaUrl: sanitizeExternalOrRelativeUrl(row.media_url),
    displayOrder: Number(row.display_order ?? 0),
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function normalizeFeaturePayload(payload: HomeFeatureUpsertPayload) {
  const label = sanitizePlainText(payload.label);
  const title = sanitizePlainText(payload.title);
  const description = sanitizeNullablePlainText(payload.description);
  const features = Array.isArray(payload.features)
    ? payload.features.map((item) => sanitizePlainText(item)).filter(Boolean)
    : [];
  const mediaType = payload.mediaType ?? null;
  const mediaUrl = sanitizeExternalOrRelativeUrl(payload.mediaUrl);
  const displayOrder = Number(payload.displayOrder ?? 0);
  const isActive = payload.isActive ?? true;

  if (!label) {
    throw new Error("Label is required.");
  }

  if (!title) {
    throw new Error("Title is required.");
  }

  if (!features.length) {
    throw new Error("At least one feature is required.");
  }

  if (mediaType !== null && mediaType !== "image" && mediaType !== "video") {
    throw new Error("Media type must be either image or video.");
  }

  if (!mediaType && mediaUrl) {
    throw new Error("Media type is required when media URL is provided.");
  }

  if (!Number.isFinite(displayOrder) || displayOrder < 0) {
    throw new Error("Display order must be a valid non-negative number.");
  }

  return {
    label,
    title,
    description,
    features,
    mediaType,
    mediaUrl,
    displayOrder: Math.floor(displayOrder),
    isActive,
  };
}

export async function listHomeFeatures(payload: HomeFeatureListPayload): Promise<ListData<HomeFeatureRow>> {
  const conditions: string[] = [];
  const params: Array<string | number> = [];
  const search = payload.search?.trim();
  const mediaType = payload.mediaType ?? null;

  if (typeof payload.isActive === "boolean") {
    conditions.push("is_active = ?");
    params.push(payload.isActive ? 1 : 0);
  }

  if (mediaType) {
    conditions.push("media_type = ?");
    params.push(mediaType);
  }

  if (search) {
    const like = `%${search}%`;
    conditions.push("(label LIKE ? OR title LIKE ? OR description LIKE ? OR media_url LIKE ?)");
    params.push(like, like, like, like);
  }

  if (!conditions.length) {
    conditions.push("1 = 1");
  }

  const rows = await queryRows<HomeFeatureDbRow>(
    `SELECT id, label, title, description, features, media_type, media_url, display_order, is_active, created_at, updated_at
     FROM home_features
     WHERE ${conditions.join(" AND ")}
     ORDER BY display_order ASC, created_at DESC`,
    params,
  );

  return {
    result: rows.map(mapHomeFeatureRow),
    count: rows.length,
  };
}

export async function getHomeFeatureById(id: number) {
  const rows = await queryRows<HomeFeatureDbRow>(
    `SELECT id, label, title, description, features, media_type, media_url, display_order, is_active, created_at, updated_at
     FROM home_features
     WHERE id = ? AND is_active = 1`,
    [id],
  );

  const row = rows[0];
  return row ? mapHomeFeatureRow(row) : null;
}

export async function upsertHomeFeature(payload: HomeFeatureUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    const normalized = normalizeFeaturePayload(payload);
    const requestedId = Number(payload.id ?? 0);

    if (requestedId > 0) {
      const [existingRows] = await connection.query<HomeFeatureDbRow[]>(
        `SELECT id FROM home_features WHERE id = ? AND is_active = 1`,
        [requestedId],
      );

      if (!existingRows[0]) {
        throw new Error("Feature not found.");
      }

      const [duplicateRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM home_features WHERE label = ? AND id <> ? AND is_active = 1`,
        [normalized.label, requestedId],
      );

      if (duplicateRows[0]) {
        throw new Error("Label must be unique.");
      }

      await connection.execute<ResultSetHeader>(
        `UPDATE home_features
         SET label = ?, title = ?, description = ?, features = ?, media_type = ?, media_url = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          normalized.label,
          normalized.title,
          normalized.description,
          JSON.stringify(normalized.features),
          normalized.mediaType,
          normalized.mediaUrl,
          normalized.displayOrder,
          normalized.isActive ? 1 : 0,
          requestedId,
        ],
      );

      await connection.commit();
      return { id: requestedId, action: "updated" as const };
    }

    const [duplicateRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
      `SELECT id FROM home_features WHERE label = ? AND is_active = 1`,
      [normalized.label],
    );

    if (duplicateRows[0]) {
      throw new Error("Label must be unique.");
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO home_features (label, title, description, features, media_type, media_url, display_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        normalized.label,
        normalized.title,
        normalized.description,
        JSON.stringify(normalized.features),
        normalized.mediaType,
        normalized.mediaUrl,
        normalized.displayOrder,
        normalized.isActive ? 1 : 0,
      ],
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

export async function deleteHomeFeature(id: number) {
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE home_features
     SET is_active = 0, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [id],
  );

  return result.affectedRows > 0;
}

export async function updateHomeFeatureMediaPath(id: number, mediaUrl: string | null) {
  const sanitizedMediaUrl = sanitizeExternalOrRelativeUrl(mediaUrl);

  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE home_features
     SET media_url = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [sanitizedMediaUrl, id],
  );

  if (result.affectedRows <= 0) {
    throw new Error("Feature not found.");
  }
}

export async function updateHomeFeatureDisplayOrder(payload: HomeFeatureDisplayOrderPayload) {
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!items.length) {
    throw new Error("At least one display order item is required.");
  }

  for (const item of items) {
    if (!Number.isInteger(item.id) || item.id <= 0) {
      throw new Error("Each item must include a valid id.");
    }

    if (!Number.isInteger(item.displayOrder) || item.displayOrder < 0) {
      throw new Error("Each item must include a valid non-negative display order.");
    }
  }

  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    const [existingRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
      `SELECT id
       FROM home_features
       WHERE id IN (${items.map(() => "?").join(", ")}) AND is_active = 1`,
      items.map((item) => item.id),
    );

    if (existingRows.length !== items.length) {
      throw new Error("One or more features were not found.");
    }

    for (const item of items) {
      await connection.execute<ResultSetHeader>(
        `UPDATE home_features
         SET display_order = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND is_active = 1`,
        [item.displayOrder, item.id],
      );
    }

    await connection.commit();
    return {
      updatedCount: items.length,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
