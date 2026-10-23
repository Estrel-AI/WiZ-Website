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

export const DEFAULT_HOME_FEATURES = [
  {
    label: "Workflow Builder",
    title: "No-Code Workflow Builder & Intent Studio",
    description: "Build agent workflows visually with clear intent definition and execution logic.",
    features: [
      "Drag-and-drop workflow design",
      "Intent configuration and flow logic",
      "Faster prototyping and deployment",
    ],
    mediaType: "video" as HomeFeatureMediaType | null,
    mediaUrl: "/api/assets/dummy_image/videos-home/workflow-builder.mp4",
    displayOrder: 1,
  },
  {
    label: "Orchestration",
    title: "Agent Orchestration Engine",
    description: "Coordinate multiple AI agents across enterprise workflows.",
    features: [
      "Multi-agent collaboration",
      "Task sequencing and orchestration",
      "Reliable workflow execution",
    ],
    mediaType: "video" as HomeFeatureMediaType | null,
    mediaUrl: "/api/assets/dummy_image/videos-home/multi-agent.mp4",
    displayOrder: 2,
  },
  {
    label: "EvalOps",
    title: "Built-in EvalOps & Monitoring",
    description: "Track, evaluate, and improve agent performance continuously.",
    features: [
      "Execution visibility",
      "Performance monitoring",
      "Built-in evaluation framework",
    ],
    mediaType: null as HomeFeatureMediaType | null,
    mediaUrl: null,
    displayOrder: 3,
  },
  {
    label: "Guardrails",
    title: "AI Governance Guardrails & Policy Enforcement",
    description: "Apply enterprise control across AI workflows and agent actions.",
    features: [
      "Policy enforcement",
      "Role-based access control",
      "Audit trails and compliance visibility",
    ],
    mediaType: "video" as HomeFeatureMediaType | null,
    mediaUrl: "/api/assets/dummy_image/videos-home/guardrail.mp4",
    displayOrder: 4,
  },
  {
    label: "MCP Integration",
    title: "MCP Administration & Integrations",
    description: "Securely connect agents with enterprise systems through Model Context Protocol (MCP).",
    features: [
      "Centralized MCP management",
      "Secure access to tools, APIs, and databases",
      "Controlled enterprise data connectivity",
    ],
    mediaType: "video" as HomeFeatureMediaType | null,
    mediaUrl: "/api/assets/dummy_image/videos-home/mcp.mp4",
    displayOrder: 5,
  },
  {
    label: "Multimodal",
    title: "Multimodal Data Handling",
    description: "Enable agents to work across multiple data formats and enterprise content types.",
    features: [
      "Text and documents",
      "PDFs, images, and video",
      "Emails, databases, and APIs",
    ],
    mediaType: null as HomeFeatureMediaType | null,
    mediaUrl: null,
    displayOrder: 6,
  },
  {
    label: "Deployment",
    title: "Flexible Deployment Infrastructure",
    description: "Deploy WiiZ based on enterprise infrastructure needs.",
    features: [
      "SaaS or self-hosted",
      "Private cloud or on-premise",
      "Air-gapped environments",
    ],
    mediaType: null as HomeFeatureMediaType | null,
    mediaUrl: null,
    displayOrder: 7,
  },
];

let isTableEnsured = false;
let isEnsuringTable = false;

export async function ensureTableAndSeed() {
  if (isTableEnsured || isEnsuringTable) {
    return;
  }

  isEnsuringTable = true;
  try {
    const pool = getMysqlPool();
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS home_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        features JSON,
        media_type ENUM('image', 'video'),
        media_url VARCHAR(500),
        display_order INT DEFAULT 0,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [existing] = await pool.query<Array<RowDataPacket & { cnt: number }>>(
      `SELECT COUNT(*) AS cnt FROM home_features WHERE is_active = 1`,
    );

    if (!existing[0] || existing[0].cnt === 0) {
      for (const feat of DEFAULT_HOME_FEATURES) {
        await pool.execute(
          `INSERT INTO home_features (label, title, description, features, media_type, media_url, display_order, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), features = VALUES(features), media_type = VALUES(media_type), media_url = VALUES(media_url), display_order = VALUES(display_order), is_active = 1`,
          [
            feat.label,
            feat.title,
            feat.description,
            JSON.stringify(feat.features),
            feat.mediaType,
            feat.mediaUrl,
            feat.displayOrder,
          ],
        );
      }
    }
    isTableEnsured = true;
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED") {
      console.warn(
        `[MySQL] Connection refused at ${error.address || "127.0.0.1"}:${error.port || 3306}. Please ensure MySQL is running in XAMPP.`,
      );
    } else {
      console.warn("[MySQL] Warning ensuring/seeding home_features table:", error?.message || error);
    }
  } finally {
    isEnsuringTable = false;
  }
}

export async function listHomeFeatures(payload: HomeFeatureListPayload): Promise<ListData<HomeFeatureRow>> {
  try {
    await ensureTableAndSeed();
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
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED") {
      console.warn("[MySQL] Database connection refused in listHomeFeatures. Returning fallback features.");
      const fallbackRows: HomeFeatureRow[] = DEFAULT_HOME_FEATURES.map((feat, idx) => ({
        id: idx + 1,
        label: feat.label,
        title: feat.title,
        description: feat.description,
        features: feat.features,
        mediaType: feat.mediaType,
        mediaUrl: feat.mediaUrl,
        displayOrder: feat.displayOrder,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      return {
        result: fallbackRows,
        count: fallbackRows.length,
      };
    }

    throw error;
  }
}

export async function getHomeFeatureById(id: number) {
  try {
    const rows = await queryRows<HomeFeatureDbRow>(
      `SELECT id, label, title, description, features, media_type, media_url, display_order, is_active, created_at, updated_at
       FROM home_features
       WHERE id = ? AND is_active = 1`,
      [id],
    );

    const row = rows[0];
    return row ? mapHomeFeatureRow(row) : null;
  } catch (error: any) {
    if (error?.code === "ECONNREFUSED") {
      console.warn("[MySQL] Database connection refused in getHomeFeatureById.");
      return null;
    }
    throw error;
  }
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
