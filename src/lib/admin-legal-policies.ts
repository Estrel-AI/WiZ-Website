import type { RowDataPacket } from "mysql2/promise";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import { policyRegistry } from "@/src/components/website/policy-content";
import type { LegalPolicyRow, LegalPolicyUpsertPayload } from "@/src/types/admin-api";

export type LegalPolicyDbRow = RowDataPacket & {
  policy_key: string;
  title: string;
  last_updated: string;
  content: string;
  created_at: string;
  updated_at: string;
};

function mapPolicyRow(row: LegalPolicyDbRow): LegalPolicyRow {
  return {
    policyKey: row.policy_key,
    title: row.title,
    lastUpdated: row.last_updated,
    content: row.content,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function ensureLegalPoliciesTable() {
  const pool = getMysqlPool();

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS legal_policies (
      policy_key VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      last_updated VARCHAR(100) NOT NULL DEFAULT '',
      content LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  const keys: Array<{ key: "terms" | "privacy" | "cookies"; defaultTitle: string; defaultDate: string }> = [
    { key: "terms", defaultTitle: "Terms and Conditions", defaultDate: "14 May 2026" },
    { key: "privacy", defaultTitle: "Privacy Policy", defaultDate: "14 May 2026" },
    { key: "cookies", defaultTitle: "Cookie Policy", defaultDate: "14 May 2026" },
  ];

  for (const item of keys) {
    const defaultData = policyRegistry[item.key];
    await pool.execute(
      `INSERT INTO legal_policies (policy_key, title, last_updated, content)
       SELECT ?, ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM legal_policies WHERE policy_key = ?
       )`,
      [
        item.key,
        defaultData?.title || item.defaultTitle,
        item.defaultDate,
        defaultData?.content || "",
        item.key,
      ],
    );
  }
}

export async function getAllLegalPoliciesAdmin(): Promise<LegalPolicyRow[]> {
  await ensureLegalPoliciesTable();
  const rows = await queryRows<LegalPolicyDbRow>(
    "SELECT * FROM legal_policies ORDER BY FIELD(policy_key, 'privacy', 'cookies', 'terms')",
  );
  return rows.map(mapPolicyRow);
}

export async function getLegalPolicyByKey(key: string): Promise<LegalPolicyRow | null> {
  await ensureLegalPoliciesTable();
  const rows = await queryRows<LegalPolicyDbRow>(
    "SELECT * FROM legal_policies WHERE policy_key = ? LIMIT 1",
    [key],
  );
  return rows[0] ? mapPolicyRow(rows[0]) : null;
}

export async function upsertLegalPolicy(payload: LegalPolicyUpsertPayload): Promise<LegalPolicyRow> {
  await ensureLegalPoliciesTable();
  const pool = getMysqlPool();

  const key = payload.policyKey.toLowerCase().trim();
  const title = payload.title.trim();
  const lastUpdated = (payload.lastUpdated || "14 May 2026").trim();
  const content = payload.content;

  await pool.execute(
    `INSERT INTO legal_policies (policy_key, title, last_updated, content)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       last_updated = VALUES(last_updated),
       content = VALUES(content),
       updated_at = CURRENT_TIMESTAMP`,
    [key, title, lastUpdated, content],
  );

  const updated = await getLegalPolicyByKey(key);
  if (!updated) {
    throw new Error("Failed to retrieve updated legal policy.");
  }
  return updated;
}
