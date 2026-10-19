import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { sanitizePlainText } from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  HomeFaqDisplayOrderPayload,
  HomeFaqListPayload,
  HomeFaqRow,
  HomeFaqUpsertPayload,
  ListData,
} from "@/src/types/admin-api";

type FaqDbRow = RowDataPacket & {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapFaqRow(row: FaqDbRow): HomeFaqRow {
  return {
    id: row.id,
    question: sanitizePlainText(row.question),
    answer: sanitizePlainText(row.answer),
    displayOrder: Number(row.display_order ?? 0),
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export const DEFAULT_FAQS = [
  {
    question: "What is WiiZ?",
    answer:
      "WiiZ is an enterprise-grade agentic AI orchestration platform designed to help teams design, deploy, and scale multi-agent workflows effortlessly.",
    displayOrder: 1,
  },
  {
    question: "How is WiiZ different from traditional AI automation platforms?",
    answer:
      "WiiZ combines autonomous multi-agent reasoning, low-code workflow orchestration, dynamic tool execution, and fine-grained enterprise governance into a single unified stack.",
    displayOrder: 2,
  },
  {
    question: "Can WiiZ orchestrate multiple AI agents and models together?",
    answer:
      "Yes! WiiZ natively connects disparate LLMs, custom fine-tuned models, and API tools into multi-agent collaborative graphs with human-in-the-loop controls.",
    displayOrder: 3,
  },
  {
    question: "Is WiiZ suitable for enterprise security and compliance?",
    answer:
      "Absolutely. WiiZ supports local on-premise execution, SOC2 compliance standards, role-based access control (RBAC), and private key management.",
    displayOrder: 4,
  },
  {
    question: "How fast can we integrate WiiZ into existing infrastructure?",
    answer:
      "You can connect your existing APIs, databases, and vector stores in minutes using our plug-and-play SDKs and pre-built integrations.",
    displayOrder: 5,
  },
];

export async function ensureHomeFaqsTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS home_faqs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const [existing] = await pool.query<Array<RowDataPacket & { cnt: number }>>(
    `SELECT COUNT(*) AS cnt FROM home_faqs WHERE is_active = 1`,
  );

  if (!existing[0] || existing[0].cnt === 0) {
    for (const item of DEFAULT_FAQS) {
      await pool.execute(
        `INSERT INTO home_faqs (question, answer, display_order, is_active)
         VALUES (?, ?, ?, 1)`,
        [item.question, item.answer, item.displayOrder],
      );
    }
  }
}

export async function listHomeFaqs(
  filter: HomeFaqListPayload = {},
): Promise<HomeFaqRow[]> {
  await ensureHomeFaqsTable();

  const search = filter.search?.trim() || "";
  const params: (string | number)[] = [];
  const whereClauses: string[] = [];

  if (search) {
    whereClauses.push("(question LIKE ? OR answer LIKE ?)");
    const pattern = `%${search}%`;
    params.push(pattern, pattern);
  }

  if (typeof filter.isActive === "boolean") {
    whereClauses.push("is_active = ?");
    params.push(filter.isActive ? 1 : 0);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const rows = await queryRows<FaqDbRow>(
    `SELECT id, question, answer, display_order, is_active, created_at, updated_at
     FROM home_faqs
     ${whereSql}
     ORDER BY display_order ASC, id ASC`,
    params,
  );

  return rows.map(mapFaqRow);
}

export async function getHomeFaqById(id: number): Promise<HomeFaqRow | null> {
  await ensureHomeFaqsTable();
  const rows = await queryRows<FaqDbRow>(
    `SELECT id, question, answer, display_order, is_active, created_at, updated_at
     FROM home_faqs
     WHERE id = ?`,
    [id],
  );

  return rows[0] ? mapFaqRow(rows[0]) : null;
}

export async function upsertHomeFaq(
  payload: HomeFaqUpsertPayload,
): Promise<HomeFaqRow> {
  await ensureHomeFaqsTable();

  const pool = getMysqlPool();
  const question = sanitizePlainText(payload.question);
  const answer = sanitizePlainText(payload.answer);
  const isActive = payload.isActive === false ? 0 : 1;

  if (!question) {
    throw new Error("Question is required.");
  }
  if (question.length > 130) {
    throw new Error("Question must be 130 characters or less.");
  }
  if (!answer) {
    throw new Error("Answer is required.");
  }
  if (answer.length > 345) {
    throw new Error("Answer must be 345 characters or less.");
  }

  if (payload.id && payload.id > 0) {
    const existing = await getHomeFaqById(payload.id);
    if (!existing) {
      throw new Error("FAQ item not found.");
    }

    const displayOrder =
      typeof payload.displayOrder === "number" && payload.displayOrder > 0
        ? payload.displayOrder
        : existing.displayOrder;

    await pool.execute(
      `UPDATE home_faqs
       SET question = ?, answer = ?, display_order = ?, is_active = ?
       WHERE id = ?`,
      [question, answer, displayOrder, isActive, payload.id],
    );

    const updated = await getHomeFaqById(payload.id);
    if (!updated) {
      throw new Error("Failed to retrieve updated FAQ item.");
    }
    return updated;
  }

  let nextDisplayOrder = payload.displayOrder;
  if (!nextDisplayOrder || nextDisplayOrder <= 0) {
    const [maxRow] = await pool.query<Array<RowDataPacket & { max_order: number | null }>>(
      `SELECT MAX(display_order) AS max_order FROM home_faqs`,
    );
    nextDisplayOrder = (maxRow[0]?.max_order ?? 0) + 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO home_faqs (question, answer, display_order, is_active)
     VALUES (?, ?, ?, ?)`,
    [question, answer, nextDisplayOrder, isActive],
  );

  const inserted = await getHomeFaqById(result.insertId);
  if (!inserted) {
    throw new Error("Failed to retrieve newly created FAQ item.");
  }
  return inserted;
}

export async function deleteHomeFaq(id: number): Promise<boolean> {
  await ensureHomeFaqsTable();
  const pool = getMysqlPool();

  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM home_faqs WHERE id = ?`,
    [id],
  );

  return result.affectedRows > 0;
}

export async function updateHomeFaqDisplayOrder(
  payload: HomeFaqDisplayOrderPayload,
): Promise<boolean> {
  await ensureHomeFaqsTable();
  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    for (const item of payload.items) {
      await connection.execute(
        `UPDATE home_faqs SET display_order = ? WHERE id = ?`,
        [item.displayOrder, item.id],
      );
    }
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
