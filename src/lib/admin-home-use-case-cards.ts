import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizeNullablePlainText, sanitizePlainText, sanitizeRichHtml } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  HomeUseCaseCardDisplayOrderPayload,
  HomeUseCaseCardListPayload,
  HomeUseCasePublicRow,
  HomeUseCaseCardRow,
  HomeUseCaseCardUpsertPayload,
  ListData,
  UseCaseDetailRow,
} from "@/src/types/admin-api";
import { listUseCaseDetailsGroupedByUseCaseIds } from "@/src/lib/admin-hierarchy";

type HomeUseCaseCardDbRow = RowDataPacket & {
  id: number;
  use_case_id: number;
  use_case_title: string;
  use_case_slug: string | null;
  display_order: number;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

type HomeUseCasePublicDbRow = RowDataPacket & {
  id: number;
  use_case_id: number;
  use_case_title: string;
  use_case_slug: string | null;
  use_case_description: string | null;
  function_id: number | null;
  function_title: string | null;
  function_slug: string | null;
  industry_id: number | null;
  industry_title: string | null;
  industry_slug: string | null;
  display_order: number;
};

const MAX_HOME_USE_CASE_CARDS = 3;

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapHomeUseCaseCardRow(row: HomeUseCaseCardDbRow): HomeUseCaseCardRow {
  return {
    id: row.id,
    useCaseId: row.use_case_id,
    useCaseTitle: sanitizePlainText(row.use_case_title),
    useCaseSlug: row.use_case_slug ? sanitizePlainText(row.use_case_slug) : null,
    displayOrder: Number(row.display_order ?? 0),
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function extractTextItems(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  return value
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function findDetail(details: UseCaseDetailRow[], type: UseCaseDetailRow["type"]) {
  return details.find((item) => item.type === type);
}

function normalizePayload(payload: HomeUseCaseCardUpsertPayload) {
  const useCaseId = Number(payload.useCaseId);
  const displayOrder = Number(payload.displayOrder ?? 0);
  const isActive = payload.isActive ?? true;

  if (!Number.isInteger(useCaseId) || useCaseId <= 0) {
    throw new Error("A valid use case id is required.");
  }

  if (!Number.isFinite(displayOrder) || displayOrder < 0) {
    throw new Error("Display order must be a valid non-negative number.");
  }

  return {
    useCaseId,
    displayOrder: Math.floor(displayOrder),
    isActive,
  };
}

async function ensureValidUseCase(connection: PoolConnection, useCaseId: number) {
  const [rows] = await connection.query<Array<RowDataPacket & { id: number }>>(
    `SELECT id
     FROM industry_hierarchy
     WHERE id = ? AND type = 'usecase' AND is_active = 1`,
    [useCaseId],
  );

  if (!rows[0]) {
    throw new Error("Selected use case was not found.");
  }
}

export async function listHomeUseCaseCards(payload: HomeUseCaseCardListPayload): Promise<ListData<HomeUseCaseCardRow>> {
  const conditions = ["card.is_active = 1"];
  const params: Array<string | number> = [];
  const search = payload.search?.trim();

  if (search) {
    const like = `%${search}%`;
    conditions.push("(uc.title LIKE ? OR uc.slug LIKE ?)");
    params.push(like, like);
  }

  const rows = await queryRows<HomeUseCaseCardDbRow>(
    `SELECT card.id,
            card.use_case_id,
            uc.title AS use_case_title,
            uc.slug AS use_case_slug,
            card.display_order,
            card.is_active,
            card.created_at,
            card.updated_at
     FROM home_use_case_cards AS card
     INNER JOIN industry_hierarchy AS uc ON uc.id = card.use_case_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY card.display_order ASC, card.created_at DESC`,
    params,
  );

  return {
    result: rows.map(mapHomeUseCaseCardRow),
    count: rows.length,
  };
}

export async function getHomeUseCaseCardById(id: number) {
  const rows = await queryRows<HomeUseCaseCardDbRow>(
    `SELECT card.id,
            card.use_case_id,
            uc.title AS use_case_title,
            uc.slug AS use_case_slug,
            card.display_order,
            card.is_active,
            card.created_at,
            card.updated_at
     FROM home_use_case_cards AS card
     INNER JOIN industry_hierarchy AS uc ON uc.id = card.use_case_id
     WHERE card.id = ?`,
    [id],
  );

  const row = rows[0];
  return row ? mapHomeUseCaseCardRow(row) : null;
}

export async function listPublicHomeUseCaseCards(): Promise<HomeUseCasePublicRow[]> {
  const rows = await queryRows<HomeUseCasePublicDbRow>(
    `SELECT card.id,
            card.use_case_id,
            uc.title AS use_case_title,
            uc.slug AS use_case_slug,
            uc.description AS use_case_description,
            fn.id AS function_id,
            fn.title AS function_title,
            fn.slug AS function_slug,
            ind.id AS industry_id,
            ind.title AS industry_title,
            ind.slug AS industry_slug,
            card.display_order
     FROM home_use_case_cards AS card
     INNER JOIN industry_hierarchy AS uc ON uc.id = card.use_case_id AND uc.is_active = 1
     LEFT JOIN industry_hierarchy AS fn ON fn.id = uc.parent_id AND fn.is_active = 1
     LEFT JOIN industry_hierarchy AS ind ON ind.id = fn.parent_id AND ind.is_active = 1
     WHERE card.is_active = 1
     ORDER BY card.display_order ASC, card.created_at DESC`,
  );

  const detailsByUseCaseId = await listUseCaseDetailsGroupedByUseCaseIds(
    rows.map((row) => row.use_case_id),
  );

  return rows.map((row) => {
      const details = detailsByUseCaseId.get(row.use_case_id) ?? [];
      const impactDetail = findDetail(details, "Impact");

      return {
      id: row.id,
      useCaseId: row.use_case_id,
      useCaseTitle: sanitizePlainText(row.use_case_title),
      useCaseSlug: row.use_case_slug ? sanitizePlainText(row.use_case_slug) : null,
      useCaseDescription: sanitizeNullablePlainText(row.use_case_description),
      functionId: row.function_id,
      functionTitle: row.function_title ? sanitizePlainText(row.function_title) : null,
      functionSlug: row.function_slug ? sanitizePlainText(row.function_slug) : null,
      industryId: row.industry_id,
      industryTitle: row.industry_title ? sanitizePlainText(row.industry_title) : null,
      industrySlug: row.industry_slug ? sanitizePlainText(row.industry_slug) : null,
        displayOrder: Number(row.display_order ?? 0),
      impactDescription: impactDetail?.description ? sanitizeRichHtml(impactDetail.description) : null,
        impactFilePath: impactDetail?.filePath ?? null,
        challenges: extractTextItems(findDetail(details, "Challenges")?.description),
        outcomes: extractTextItems(findDetail(details, "Outcome")?.description),
        artifacts: extractTextItems(findDetail(details, "Artifacts")?.description),
      };
    });
}

export async function upsertHomeUseCaseCard(payload: HomeUseCaseCardUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    const normalized = normalizePayload(payload);
    const requestedId = Number(payload.id ?? 0);

    await ensureValidUseCase(connection, normalized.useCaseId);

    if (requestedId > 0) {
      const [existingRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM home_use_case_cards WHERE id = ?`,
        [requestedId],
      );

      if (!existingRows[0]) {
        throw new Error("Home use case card not found.");
      }

      const [duplicateRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM home_use_case_cards WHERE use_case_id = ? AND id <> ? AND is_active = 1`,
        [normalized.useCaseId, requestedId],
      );

      if (duplicateRows[0]) {
        throw new Error("This use case is already assigned to a homepage card.");
      }

      await connection.execute<ResultSetHeader>(
        `UPDATE home_use_case_cards
         SET use_case_id = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [normalized.useCaseId, normalized.displayOrder, normalized.isActive ? 1 : 0, requestedId],
      );

      await connection.commit();
      return { id: requestedId, action: "updated" as const };
    }

    const [countRows] = await connection.query<Array<RowDataPacket & { total: number }>>(
      `SELECT COUNT(*) AS total
       FROM home_use_case_cards
       WHERE is_active = 1`,
    );

    const activeCount = Number(countRows[0]?.total ?? 0);
    if (activeCount >= MAX_HOME_USE_CASE_CARDS) {
      throw new Error(`Only ${MAX_HOME_USE_CASE_CARDS} home use cases can be added.`);
    }

    const [duplicateRows] = await connection.query<
      Array<RowDataPacket & { id: number; is_active: number | boolean }>
    >(
      `SELECT id, is_active FROM home_use_case_cards WHERE use_case_id = ? LIMIT 1`,
      [normalized.useCaseId],
    );

    if (duplicateRows[0]) {
      const duplicateId = Number(duplicateRows[0].id);
      const duplicateIsActive = Boolean(duplicateRows[0].is_active);

      if (duplicateIsActive) {
        throw new Error("This use case is already assigned to a homepage card.");
      }

      await connection.execute<ResultSetHeader>(
        `UPDATE home_use_case_cards
         SET display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [normalized.displayOrder, normalized.isActive ? 1 : 0, duplicateId],
      );

      await connection.commit();
      return { id: duplicateId, action: "updated" as const };
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO home_use_case_cards (use_case_id, display_order, is_active, created_at, updated_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [normalized.useCaseId, normalized.displayOrder, normalized.isActive ? 1 : 0],
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

export async function deleteHomeUseCaseCard(id: number) {
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE home_use_case_cards
     SET is_active = 0, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [id],
  );

  return result.affectedRows > 0;
}

export async function updateHomeUseCaseCardDisplayOrder(payload: HomeUseCaseCardDisplayOrderPayload) {
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
       FROM home_use_case_cards
       WHERE id IN (${items.map(() => "?").join(", ")}) AND is_active = 1`,
      items.map((item) => item.id),
    );

    if (existingRows.length !== items.length) {
      throw new Error("One or more home use case cards were not found.");
    }

    for (const item of items) {
      await connection.execute<ResultSetHeader>(
        `UPDATE home_use_case_cards
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
