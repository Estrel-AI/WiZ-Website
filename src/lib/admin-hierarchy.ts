import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { createSlug } from "@/src/lib/admin-cms";
import {
  sanitizeNullablePlainText,
  sanitizePlainText,
  sanitizeRichHtml,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  BulkDeletePayload,
  FunctionBulkUpsertGroup,
  FunctionBulkUpsertPayload,
  HierarchyBulkItemInput,
  HierarchyListPayload,
  HierarchyNodeType,
  HierarchyRow,
  ListData,
  SortOrder,
  SelectOption,
  UseCaseDetailRow,
  UseCaseDetailNestedInput,
  UseCaseDetailType,
  UseCaseDetailUpsertPayload,
  UseCaseUpsertPayload,
} from "@/src/types/admin-api";

type HierarchyDbRow = RowDataPacket & {
  id: number;
  parent_id: number | null;
  parent_title: string | null;
  title: string;
  type: HierarchyNodeType;
  description: string | null;
  slug: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type UseCaseDetailDbRow = RowDataPacket & {
  id: number;
  hierarchy_id: number;
  type: UseCaseDetailType;
  description: string;
  file_path: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type CountRow = RowDataPacket & { total: number };

type QueryState = {
  page: number;
  limit: number;
  offset: number;
  search: string;
  sortBy: string;
  sortOrder: SortOrder;
};

const hierarchySortMap = {
  title: "child.title",
  created_at: "child.created_at",
  updated_at: "child.updated_at",
  type: "child.type",
} as const;

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapHierarchyRow(row: HierarchyDbRow): HierarchyRow {
  return {
    id: row.id,
    parentId: row.parent_id,
    parentTitle: row.parent_title ? sanitizePlainText(row.parent_title) : null,
    title: sanitizePlainText(row.title),
    type: row.type,
    description: sanitizeNullablePlainText(row.description),
    slug: row.slug ? sanitizePlainText(row.slug) : null,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function mapUseCaseDetailRow(row: UseCaseDetailDbRow): UseCaseDetailRow {
  return {
    id: row.id,
    useCaseId: row.hierarchy_id,
    type: row.type,
    description: sanitizeRichHtml(row.description),
    filePath: sanitizeNullablePlainText(row.file_path),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function normalizeQueryBase(payload: HierarchyListPayload): QueryState {
  const page = Number.isFinite(payload.page) && (payload.page ?? 0) > 0 ? Number(payload.page) : 1;
  const limitCandidate =
    Number.isFinite(payload.limit) && (payload.limit ?? 0) > 0 ? Number(payload.limit) : 10;
  const limit = Math.min(limitCandidate, 100);
  const sortOrder: SortOrder = payload.sortOrder === "asc" ? "asc" : "desc";
  const sortBy =
    payload.sortBy && payload.sortBy in hierarchySortMap
      ? hierarchySortMap[payload.sortBy as keyof typeof hierarchySortMap]
      : "child.updated_at";

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    search: payload.search?.trim() ?? "",
    sortBy,
    sortOrder,
  };
}

function buildHierarchyWhere(payload: HierarchyListPayload, tableAlias = "") {
  const prefix = tableAlias ? `${tableAlias}.` : "";
  const conditions = [`${prefix}is_active = 1`];
  const params: Array<string | number> = [];

  if (payload.type) {
    conditions.push(`${prefix}type = ?`);
    params.push(payload.type);
  }

  if (typeof payload.parentId === "number") {
    conditions.push(`${prefix}parent_id = ?`);
    params.push(payload.parentId);
  }

  const search = payload.search?.trim();
  if (search) {
    conditions.push(`(${prefix}title LIKE ? OR ${prefix}description LIKE ?)`);
    const like = `%${search}%`;
    params.push(like, like);
  }

  return {
    whereSql: conditions.join(" AND "),
    params,
  };
}

export async function listHierarchy(
  payload: HierarchyListPayload,
): Promise<ListData<HierarchyRow>> {
  const queryState = normalizeQueryBase(payload);
  const { whereSql, params } = buildHierarchyWhere(payload, "child");
  const { whereSql: countWhereSql } = buildHierarchyWhere(payload);

  const rows = await queryRows<HierarchyDbRow>(
    `SELECT child.id,
            child.parent_id,
            parent.title AS parent_title,
            child.title,
            child.type,
            child.description,
            child.slug,
            child.created_at,
            child.updated_at
     FROM industry_hierarchy AS child
     LEFT JOIN industry_hierarchy AS parent ON parent.id = child.parent_id
     WHERE ${whereSql}
     ORDER BY ${queryState.sortBy} ${queryState.sortOrder}
     LIMIT ? OFFSET ?`,
    [...params, queryState.limit, queryState.offset],
  );

  const countRows = await queryRows<CountRow>(
    `SELECT COUNT(*) AS total
     FROM industry_hierarchy
     WHERE ${countWhereSql}`,
    params,
  );

  const total = countRows[0]?.total ?? 0;

  return {
    result: rows.map(mapHierarchyRow),
    count: total,
  };
}

export async function listUseCaseCombo(search?: string): Promise<SelectOption[]> {
  const params: Array<string | number> = [];
  const conditions = [`child.type = 'usecase'`, "child.is_active = 1"];
  const query = search?.trim();

  if (query) {
    const like = `%${query}%`;
    conditions.push("(child.title LIKE ? OR child.slug LIKE ?)");
    params.push(like, like);
  }

  const rows = await queryRows<HierarchyDbRow>(
    `SELECT child.id,
            child.parent_id,
            parent.title AS parent_title,
            child.title,
            child.type,
            child.description,
            child.slug,
            child.created_at,
            child.updated_at
     FROM industry_hierarchy AS child
     LEFT JOIN industry_hierarchy AS parent ON parent.id = child.parent_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY child.title ASC`,
    params,
  );

  return rows.map((row) => ({
    id: row.id,
    label: row.title,
    value: String(row.id),
    slug: row.slug,
  }));
}

async function getHierarchyNodeById(
  connection: PoolConnection,
  id: number,
) {
  const [rows] = await connection.query<HierarchyDbRow[]>(
    `SELECT id, parent_id, title, type, description, slug, created_at, updated_at
     FROM industry_hierarchy
     WHERE id = ?`,
    [id],
  );

  return rows[0] ?? null;
}

async function ensureParentType(
  connection: PoolConnection,
  parentId: number | null,
  expectedType: HierarchyNodeType,
) {
  if (parentId === null) {
    throw new Error(`Parent of type "${expectedType}" is required.`);
  }

  const parent = await getHierarchyNodeById(connection, parentId);
  if (!parent || parent.type !== expectedType || parent.id <= 0) {
    throw new Error(`Parent must be an active ${expectedType}.`);
  }

  if (parent.type !== expectedType || parent.id <= 0) {
    throw new Error(`Parent must be an active ${expectedType}.`);
  }

  return parent;
}

function sanitizeTitle(value: string) {
  const title = sanitizePlainText(value);
  if (!title) {
    throw new Error("Title is required.");
  }
  return title;
}

async function releaseInactiveHierarchySlug(
  connection: PoolConnection,
  slug: string,
  excludeId?: number,
) {
  const params: Array<string | number> = [slug];
  let query = `SELECT id FROM industry_hierarchy WHERE slug = ? AND is_active = 0`;

  if (excludeId && excludeId > 0) {
    query += ` AND id <> ?`;
    params.push(excludeId);
  }

  const [rows] = await connection.query<Array<RowDataPacket & { id: number }>>(query, params);
  const reusable = rows[0];

  if (!reusable) {
    return;
  }

  await connection.execute<ResultSetHeader>(
    `UPDATE industry_hierarchy
     SET slug = CONCAT(COALESCE(slug, ''), '--deleted-', id), updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 0`,
    [reusable.id],
  );
}

async function upsertHierarchyItems(
  connection: PoolConnection,
  type: HierarchyNodeType,
  parentId: number | null,
  items: HierarchyBulkItemInput[],
) {
  if (!items.length) {
    throw new Error("At least one item is required.");
  }

  const results: Array<{ id: number; action: "created" | "updated" }> = [];

  for (const item of items) {
    const title = sanitizeTitle(item.title);
    const description = sanitizeNullablePlainText(item.description);
    const requestedId = Number(item.id ?? 0);
    const slug = createSlug(title);

    if (requestedId > 0) {
      const existing = await getHierarchyNodeById(connection, requestedId);
      if (!existing || existing.type !== type) {
        throw new Error(`Unable to update ${type} with id ${requestedId}.`);
      }

      if (type === "industry" && existing.parent_id !== null) {
        throw new Error("Industry rows cannot have a parent.");
      }

      await releaseInactiveHierarchySlug(connection, slug, requestedId);

      await connection.execute<ResultSetHeader>(
        `UPDATE industry_hierarchy
         SET parent_id = ?, title = ?, description = ?, slug = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [parentId, title, description, slug, requestedId],
      );

      results.push({ id: requestedId, action: "updated" });
      continue;
    }

    await releaseInactiveHierarchySlug(connection, slug);

    const [insertResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO industry_hierarchy (parent_id, title, type, description, slug, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [parentId, title, type, description, slug],
    );

    results.push({ id: Number(insertResult.insertId), action: "created" });
  }

  return results;
}

export async function bulkUpsertIndustries(items: HierarchyBulkItemInput[]) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();
    const results = await upsertHierarchyItems(connection, "industry", null, items);
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function bulkUpsertFunctions(payload: FunctionBulkUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();
    await ensureParentType(connection, payload.industryId, "industry");
    const results = await upsertHierarchyItems(connection, "function", payload.industryId, payload.items);
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function bulkUpsertFunctionsByIndustryGroups(payload: FunctionBulkUpsertGroup[]) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    if (!payload.length) {
      throw new Error("At least one function group is required.");
    }

    const results: Array<{ id: number; action: "created" | "updated" }> = [];

    for (const group of payload) {
      const industryId = Number(group.industryId ?? 0);

      if (industryId <= 0) {
        throw new Error("Each function group must include a valid industryId.");
      }

      await ensureParentType(connection, industryId, "industry");
      const batchResults = await upsertHierarchyItems(connection, "function", industryId, group.items ?? []);
      results.push(...batchResults);
    }

    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function upsertUseCase(payload: UseCaseUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();
    await ensureParentType(connection, payload.functionId, "function");

    const results = await upsertHierarchyItems(connection, "usecase", payload.functionId, [
      {
        id: payload.id,
        title: payload.title,
        description: payload.description ?? null,
      },
    ]);

    const useCaseResult = results[0];
    const useCaseDetails = await upsertUseCaseDetailsInTransaction(connection, useCaseResult.id, payload.usecaseDetails ?? []);

    await connection.commit();
    return {
      useCase: useCaseResult,
      useCaseDetails,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function collectDescendantIds(connection: PoolConnection, parentIds: number[]): Promise<number[]> {
  if (!parentIds.length) {
    return [];
  }

  const descendants = new Set<number>(parentIds);
  let frontier = [...parentIds];

  while (frontier.length) {
    const placeholders = frontier.map(() => "?").join(", ");
    const [rows] = await connection.query<Array<RowDataPacket & { id: number }>>(
      `SELECT id FROM industry_hierarchy WHERE parent_id IN (${placeholders}) AND is_active = 1`,
      frontier,
    );
    frontier = rows.map((row) => row.id).filter((id) => !descendants.has(id));
    for (const id of frontier) {
      descendants.add(id);
    }
  }

  return Array.from(descendants);
}

async function softDeleteHierarchy(ids: number[]) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();
    const allIds = await collectDescendantIds(connection, ids);

    if (!allIds.length) {
      throw new Error("No valid rows found to delete.");
    }

    const placeholders = allIds.map(() => "?").join(", ");
    await connection.execute<ResultSetHeader>(
      `UPDATE industry_hierarchy
       SET is_active = 0,
           slug = CONCAT(COALESCE(slug, ''), '--deleted-', id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id IN (${placeholders})`,
      allIds,
    );

    await connection.execute<ResultSetHeader>(
      `UPDATE use_case_details
       SET is_active = 0, updated_at = CURRENT_TIMESTAMP
       WHERE hierarchy_id IN (${placeholders})`,
      allIds,
    );

    await connection.commit();
    return allIds;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function bulkDeleteIndustries(payload: BulkDeletePayload) {
  return softDeleteHierarchy(payload.ids);
}

export async function bulkDeleteFunctions(payload: BulkDeletePayload) {
  return softDeleteHierarchy(payload.ids);
}

export async function deleteUseCase(id: number) {
  const ids = await softDeleteHierarchy([id]);
  return ids[0] ?? id;
}

export async function listUseCaseDetailsByUseCase(useCaseId: number) {
  const useCases = await queryRows<HierarchyDbRow>(
    `SELECT id, parent_id, title, type, description, slug, created_at, updated_at
     FROM industry_hierarchy
     WHERE id = ? AND type = 'usecase' AND is_active = 1`,
    [useCaseId],
  );

  if (!useCases[0]) {
    return null;
  }

  const details = await queryRows<UseCaseDetailDbRow>(
    `SELECT id, hierarchy_id, type, description, file_path, created_at, updated_at
     FROM use_case_details
     WHERE hierarchy_id = ? AND is_active = 1
     ORDER BY FIELD(type, 'Challenges', 'Impact', 'Outcome', 'Artifacts'), updated_at DESC`,
    [useCaseId],
  );

  return {
    useCase: mapHierarchyRow(useCases[0]),
    details: details.map(mapUseCaseDetailRow),
  };
}

export async function listUseCaseDetailsGroupedByUseCaseIds(useCaseIds: number[]) {
  const normalizedIds = Array.from(
    new Set(useCaseIds.filter((id) => Number.isInteger(id) && id > 0)),
  );

  if (!normalizedIds.length) {
    return new Map<number, UseCaseDetailRow[]>();
  }

  const details = await queryRows<UseCaseDetailDbRow>(
    `SELECT id, hierarchy_id, type, description, file_path, created_at, updated_at
     FROM use_case_details
     WHERE hierarchy_id IN (${normalizedIds.map(() => "?").join(", ")}) AND is_active = 1
     ORDER BY hierarchy_id ASC, FIELD(type, 'Challenges', 'Impact', 'Outcome', 'Artifacts'), updated_at DESC`,
    normalizedIds,
  );

  const grouped = new Map<number, UseCaseDetailRow[]>();

  for (const detail of details) {
    const mapped = mapUseCaseDetailRow(detail);
    const items = grouped.get(mapped.useCaseId) ?? [];
    items.push(mapped);
    grouped.set(mapped.useCaseId, items);
  }

  return grouped;
}

async function upsertUseCaseDetailInTransaction(
  connection: PoolConnection,
  payload: UseCaseDetailUpsertPayload,
) {
  const useCase = await getHierarchyNodeById(connection, payload.useCaseId);
  if (!useCase || useCase.type !== "usecase" || useCase.id <= 0) {
    throw new Error("Use case not found.");
  }

  const description = sanitizeRichHtml(payload.description);
  if (!description) {
    throw new Error("Description is required.");
  }

  const requestedId = Number(payload.id ?? 0);

  if (requestedId > 0) {
    const [rows] = await connection.query<UseCaseDetailDbRow[]>(
      `SELECT id, hierarchy_id, type, description, file_path, created_at, updated_at
       FROM use_case_details
       WHERE id = ?`,
      [requestedId],
    );
    const existing = rows[0];
    if (!existing || existing.hierarchy_id !== payload.useCaseId) {
      throw new Error("Use case detail row not found.");
    }

    const filePath = sanitizeNullablePlainText(payload.filePath);

    await connection.execute<ResultSetHeader>(
      `UPDATE use_case_details
       SET type = ?, description = ?, file_path = ?, updated_at = CURRENT_TIMESTAMP, is_active = 1
       WHERE id = ?`,
      [payload.type, description, filePath, requestedId],
    );

    return { id: requestedId, action: "updated" as const };
  }

  const [insertResult] = await connection.execute<ResultSetHeader>(
    `INSERT INTO use_case_details (hierarchy_id, type, description, file_path, is_active, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [payload.useCaseId, payload.type, description, sanitizeNullablePlainText(payload.filePath)],
  );

  return { id: Number(insertResult.insertId), action: "created" as const };
}

async function upsertUseCaseDetailsInTransaction(
  connection: PoolConnection,
  useCaseId: number,
  details: UseCaseDetailNestedInput[],
) {
  const results: Array<{ id: number; action: "created" | "updated" }> = [];

  for (const detail of details) {
    results.push(
      await upsertUseCaseDetailInTransaction(connection, {
        id: detail.id,
        useCaseId,
        type: detail.type,
        description: detail.description,
      }),
    );
  }

  const activeDetailIds = results.map((item) => item.id).filter((id) => id > 0);
  if (activeDetailIds.length) {
    const placeholders = activeDetailIds.map(() => "?").join(", ");
    await connection.execute<ResultSetHeader>(
      `UPDATE use_case_details
       SET is_active = 0, updated_at = CURRENT_TIMESTAMP
       WHERE hierarchy_id = ? AND is_active = 1 AND id NOT IN (${placeholders})`,
      [useCaseId, ...activeDetailIds],
    );
  } else {
    await connection.execute<ResultSetHeader>(
      `UPDATE use_case_details
       SET is_active = 0, updated_at = CURRENT_TIMESTAMP
       WHERE hierarchy_id = ? AND is_active = 1`,
      [useCaseId],
    );
  }

  return results;
}

export async function upsertUseCaseDetail(payload: UseCaseDetailUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();
    const result = await upsertUseCaseDetailInTransaction(connection, payload);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteUseCaseDetail(id: number) {
  const result = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE use_case_details
     SET is_active = 0, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [id],
  );

  const affectedRows = result[0].affectedRows;
  return affectedRows > 0;
}

export async function updateUseCaseDetailFilePath(id: number, filePath: string | null) {
  const sanitizedFilePath = sanitizeNullablePlainText(filePath);

  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `UPDATE use_case_details
     SET file_path = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND is_active = 1`,
    [sanitizedFilePath, id],
  );

  if (result.affectedRows <= 0) {
    throw new Error("Use case detail row not found.");
  }
}

export async function getIndustryFunctionsUseCases(industryId: number) {
  const industries = await queryRows<HierarchyDbRow>(
    `SELECT id, parent_id, title, type, description, slug, created_at, updated_at
     FROM industry_hierarchy
     WHERE id = ? AND type = 'industry' AND is_active = 1`,
    [industryId],
  );

  const industry = industries[0];
  if (!industry) {
    return null;
  }

  const functions = await queryRows<HierarchyDbRow>(
    `SELECT id, parent_id, title, type, description, slug, created_at, updated_at
     FROM industry_hierarchy
     WHERE parent_id = ? AND type = 'function' AND is_active = 1
     ORDER BY title ASC`,
    [industryId],
  );

  const functionIds = functions.map((item) => item.id);
  const useCases = functionIds.length
    ? await queryRows<HierarchyDbRow>(
        `SELECT id, parent_id, title, type, description, slug, created_at, updated_at
         FROM industry_hierarchy
         WHERE parent_id IN (${functionIds.map(() => "?").join(", ")}) AND type = 'usecase' AND is_active = 1
         ORDER BY title ASC`,
        functionIds,
      )
    : [];

  return {
    industry: {
      id: industry.id,
      title: industry.title,
      description: industry.description,
    },
    functions: functions.map((fn) => ({
      id: fn.id,
      title: fn.title,
      description: fn.description,
      useCases: useCases
        .filter((useCase) => useCase.parent_id === fn.id)
        .map((useCase) => ({
          id: useCase.id,
          title: useCase.title,
          description: useCase.description,
        })),
    })),
  };
}






