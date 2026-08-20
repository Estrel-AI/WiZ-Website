import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  sanitizeNullablePlainText,
  sanitizePlainText,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  HeroSectionData,
  HeroSectionRow,
  HeroSectionUpsertPayload,
} from "@/src/types/admin-api";

type HeroSectionDbRow = RowDataPacket & {
  id: number;
  data: string | Record<string, unknown> | null;
  created_at: Date | string;
  updated_at: Date | string;
};

const HERO_DATA_KEYS = [
  "salesBarText",
  "heroHeading",
  "highlightedHeading",
  "shortDescription",
  "buttonText",
  "buttonText2",
  "filepath",
] as const;

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function normalizeString(value: unknown, label: string) {
  if (typeof value !== "string") {
    throw new Error(`${label} must be a string.`);
  }

  return sanitizePlainText(value);
}

function normalizeNullableString(value: unknown, label: string) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`${label} must be a string or null.`);
  }

  return sanitizeNullablePlainText(value);
}

function normalizeHeroSectionData(input: unknown): HeroSectionData {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Hero section data is required.");
  }

  const record = input as Record<string, unknown>;

  return {
    salesBarText: normalizeString(record.salesBarText ?? "", "salesBarText"),
    heroHeading: normalizeString(record.heroHeading ?? "", "heroHeading"),
    highlightedHeading: normalizeString(record.highlightedHeading ?? "", "highlightedHeading"),
    shortDescription: normalizeString(record.shortDescription ?? "", "shortDescription"),
    buttonText: normalizeString(record.buttonText ?? "", "buttonText"),
    buttonText2: normalizeString(record.buttonText2 ?? "", "buttonText2"),
    filepath: normalizeNullableString(record.filepath ?? null, "filepath"),
  };
}

function parseHeroSectionData(value: HeroSectionDbRow["data"]) {
  if (!value) {
    return {} as Record<string, unknown>;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return {} as Record<string, unknown>;
    }

    return JSON.parse(trimmed) as Record<string, unknown>;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  throw new Error("Hero section data is invalid.");
}

function mapHeroSectionRow(row: HeroSectionDbRow): HeroSectionRow {
  const parsed = parseHeroSectionData(row.data);

  return {
    id: row.id,
    data: {
      salesBarText: typeof parsed.salesBarText === "string" ? parsed.salesBarText : "",
      heroHeading: typeof parsed.heroHeading === "string" ? parsed.heroHeading : "",
      highlightedHeading: typeof parsed.highlightedHeading === "string" ? parsed.highlightedHeading : "",
      shortDescription: typeof parsed.shortDescription === "string" ? parsed.shortDescription : "",
      buttonText: typeof parsed.buttonText === "string" ? parsed.buttonText : "",
      buttonText2: typeof parsed.buttonText2 === "string" ? parsed.buttonText2 : "",
      filepath: typeof parsed.filepath === "string" && parsed.filepath.trim() ? parsed.filepath : null,
    },
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export async function getHeroSection() {
  const rows = await queryRows<HeroSectionDbRow>(
    `SELECT id, data, created_at, updated_at
     FROM hero_section
     ORDER BY updated_at DESC, id DESC
     LIMIT 1`,
  );

  const row = rows[0];
  return row ? mapHeroSectionRow(row) : null;
}

export async function updateHeroSectionFilePath(id: number, filepath: string | null) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query<HeroSectionDbRow[]>(
      `SELECT id, data, created_at, updated_at
       FROM hero_section
       WHERE id = ?`,
      [id],
    );

    const row = rows[0];
    if (!row) {
      throw new Error("Hero section not found.");
    }

    const current = mapHeroSectionRow(row);
    const sanitizedFilePath = sanitizeNullablePlainText(filepath);
    const jsonData = JSON.stringify({
      ...current.data,
      filepath: sanitizedFilePath,
    });

    await connection.execute<ResultSetHeader>(
      `UPDATE hero_section
       SET data = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [jsonData, id],
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function upsertHeroSection(payload: HeroSectionUpsertPayload) {
  const connection = await getMysqlPool().getConnection();

  try {
    await connection.beginTransaction();

    const requestedId = Number(payload.id ?? 0);
    const data = normalizeHeroSectionData(payload.data);
    const jsonData = JSON.stringify(
      HERO_DATA_KEYS.reduce<Record<string, string | null>>((accumulator, key) => {
        accumulator[key] = data[key];
        return accumulator;
      }, {}),
    );

    if (requestedId > 0) {
      const [existingRows] = await connection.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM hero_section WHERE id = ?`,
        [requestedId],
      );

      if (!existingRows[0]) {
        throw new Error("Hero section not found.");
      }

      await connection.execute<ResultSetHeader>(
        `UPDATE hero_section
         SET data = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [jsonData, requestedId],
      );

      await connection.commit();
      return { id: requestedId, action: "updated" as const };
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO hero_section (data, created_at, updated_at)
       VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [jsonData],
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
