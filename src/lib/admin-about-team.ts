import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  sanitizeExternalOrRelativeUrl,
  sanitizeNullablePlainText,
  sanitizePlainText,
} from "@/src/lib/input-sanitization";
import { getMysqlPool, queryRows } from "@/src/lib/mysql";
import type {
  AboutTeamCategory,
  AboutTeamMemberDisplayOrderItem,
  AboutTeamMemberListPayload,
  AboutTeamMemberRow,
  AboutTeamMemberUpsertPayload,
} from "@/src/types/admin-api";

type AboutTeamMemberDbRow = RowDataPacket & {
  id: number;
  category: string;
  name: string;
  designation: string | null;
  image: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_active: number;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(val: Date | string): string {
  return val instanceof Date ? val.toISOString() : new Date(val).toISOString();
}

function mapTeamMemberRow(row: AboutTeamMemberDbRow): AboutTeamMemberRow {
  return {
    id: row.id,
    category: row.category as AboutTeamCategory,
    name: sanitizePlainText(row.name),
    designation: sanitizeNullablePlainText(row.designation),
    image: sanitizeExternalOrRelativeUrl(row.image),
    linkedinUrl: sanitizeExternalOrRelativeUrl(row.linkedin_url),
    displayOrder: row.display_order,
    isActive: Boolean(row.is_active),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

const DEFAULT_LEADERSHIP_MEMBERS = [
  {
    name: "Vishal Malhotra",
    designation: "Co-Founder - CEO",
    image: "/api/assets/dummy_image/team-images/leadership/Vishal Malhotra.jpg",
    linkedinUrl: "https://www.linkedin.com/in/vishalamalhotra",
  },
  {
    name: "Mausam Hajela",
    designation: "Co-founder - Chief of Product and Strategy",
    image: "/api/assets/dummy_image/team-images/leadership/Mausam Hajela_.jpg",
    linkedinUrl: "https://www.linkedin.com/in/mausumhajela",
  },
  {
    name: "Sachin Anchal",
    designation: "Co-founder - Chief of Tech Partnerships",
    image: "/api/assets/dummy_image/team-images/leadership/Sachin Anchal_.jpg",
    linkedinUrl: "https://www.linkedin.com/in/sachinanchal19",
  },
  {
    name: "Shruti Sinha",
    designation: "Head of Product Engineering",
    image: "/api/assets/dummy_image/team-images/leadership/Shruti Sinha.jpg",
    linkedinUrl: "https://www.linkedin.com/in/shruti-sinha28",
  },
  {
    name: "Anshumita Singh",
    designation: "Head of AI Consulting and BFS Business Unit",
    image: "/api/assets/dummy_image/team-images/leadership/Anshumita Singh_.jpg",
    linkedinUrl: "https://www.linkedin.com/in/anshumita-singh-4658b918b",
  },
];

const DEFAULT_PRODUCT_MEMBERS = [
  { name: "Yamini Hire", designation: null, image: "/api/assets/dummy_image/team-images/product team/yamini-hire.jpg", linkedinUrl: null },
  { name: "Manish Gupta", designation: null, image: "/api/assets/dummy_image/team-images/product team/Manish Gupta.jpeg", linkedinUrl: null },
  { name: "Shivam Kumar", designation: null, image: "/api/assets/dummy_image/team-images/product team/Shivam Kumar.jpeg", linkedinUrl: null },
  { name: "Nishansha Negi", designation: null, image: "/api/assets/dummy_image/team-images/product team/Nishansha Negi.jpeg", linkedinUrl: null },
  { name: "Varun Verma", designation: null, image: "/api/assets/dummy_image/team-images/product team/Varun Verma.jpeg", linkedinUrl: null },
  { name: "Pravalika Panchamurthi", designation: null, image: "/api/assets/dummy_image/team-images/product team/Pravalika.jpeg", linkedinUrl: null },
  { name: "Kasireddy Sai Shruthi", designation: null, image: "/api/assets/dummy_image/team-images/product team/kasireddy-sai-shruthi.jpg", linkedinUrl: null },
  { name: "Eshan Sharma", designation: null, image: "/api/assets/dummy_image/team-images/product team/Eshan.jpg", linkedinUrl: null },
  { name: "Gowtham Sai", designation: null, image: "/api/assets/dummy_image/team-images/product team/gowtham.jpg", linkedinUrl: null },
  { name: "Saman Rashid", designation: null, image: "/api/assets/dummy_image/team-images/product team/saman-rashid.jpg", linkedinUrl: null },
];

export async function ensureAboutTeamMembersTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS about_team_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(255),
      image VARCHAR(500),
      linkedin_url VARCHAR(500),
      display_order INT NOT NULL DEFAULT 1,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_display_order (display_order),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Clean up any duplicate records created by concurrent initial requests
  await pool.execute(`
    DELETE t1 FROM about_team_members t1
    INNER JOIN about_team_members t2 
    ON t1.category = t2.category AND t1.name = t2.name
    WHERE t1.id > t2.id
  `);

  const existingLeadership = await queryRows<AboutTeamMemberDbRow>(
    `SELECT id FROM about_team_members WHERE category = 'LEADERSHIP' LIMIT 1`,
  );
  if (!existingLeadership.length) {
    for (let i = 0; i < DEFAULT_LEADERSHIP_MEMBERS.length; i++) {
      const item = DEFAULT_LEADERSHIP_MEMBERS[i];
      await pool.execute(
        `INSERT INTO about_team_members (category, name, designation, image, linkedin_url, display_order, is_active)
         SELECT 'LEADERSHIP', ?, ?, ?, ?, ?, 1
         FROM DUAL
         WHERE NOT EXISTS (
           SELECT 1 FROM about_team_members WHERE category = 'LEADERSHIP' AND name = ?
         )`,
        [item.name, item.designation, item.image, item.linkedinUrl, i + 1, item.name],
      );
    }
  }

  const existingProduct = await queryRows<AboutTeamMemberDbRow>(
    `SELECT id FROM about_team_members WHERE category = 'PRODUCT' LIMIT 1`,
  );
  if (!existingProduct.length) {
    for (let i = 0; i < DEFAULT_PRODUCT_MEMBERS.length; i++) {
      const item = DEFAULT_PRODUCT_MEMBERS[i];
      await pool.execute(
        `INSERT INTO about_team_members (category, name, designation, image, linkedin_url, display_order, is_active)
         SELECT 'PRODUCT', ?, ?, ?, ?, ?, 1
         FROM DUAL
         WHERE NOT EXISTS (
           SELECT 1 FROM about_team_members WHERE category = 'PRODUCT' AND name = ?
         )`,
        [item.name, item.designation, item.image, item.linkedinUrl, i + 1, item.name],
      );
    }
  }
}

export async function listAboutTeamMembers(
  filter: AboutTeamMemberListPayload = {},
): Promise<AboutTeamMemberRow[]> {
  await ensureAboutTeamMembersTable();

  const search = filter.search?.trim() || "";
  const params: (string | number)[] = [];
  const whereClauses: string[] = [];

  if (filter.category) {
    whereClauses.push("category = ?");
    params.push(filter.category);
  }

  if (search) {
    whereClauses.push("(name LIKE ? OR designation LIKE ?)");
    const pattern = `%${search}%`;
    params.push(pattern, pattern);
  }

  if (typeof filter.isActive === "boolean") {
    whereClauses.push("is_active = ?");
    params.push(filter.isActive ? 1 : 0);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const rows = await queryRows<AboutTeamMemberDbRow>(
    `SELECT id, category, name, designation, image, linkedin_url, display_order, is_active, created_at, updated_at
     FROM about_team_members
     ${whereSql}
     ORDER BY display_order ASC, id ASC`,
    params,
  );

  return rows.map(mapTeamMemberRow);
}

export async function getAboutTeamMemberById(id: number): Promise<AboutTeamMemberRow | null> {
  await ensureAboutTeamMembersTable();
  const rows = await queryRows<AboutTeamMemberDbRow>(
    `SELECT id, category, name, designation, image, linkedin_url, display_order, is_active, created_at, updated_at
     FROM about_team_members
     WHERE id = ?`,
    [id],
  );
  return rows[0] ? mapTeamMemberRow(rows[0]) : null;
}

export async function upsertAboutTeamMember(
  payload: AboutTeamMemberUpsertPayload,
): Promise<AboutTeamMemberRow> {
  await ensureAboutTeamMembersTable();
  const pool = getMysqlPool();

  const name = sanitizePlainText(payload.name);
  if (!name) throw new Error("Name is required.");

  const category = payload.category;
  if (category !== "LEADERSHIP" && category !== "PRODUCT") {
    throw new Error("Invalid team category.");
  }

  const maxNameLength = category === "PRODUCT" ? 60 : 50;
  if (name.length > maxNameLength) throw new Error(`Name must be ${maxNameLength} characters or less.`);

  const designation = sanitizeNullablePlainText(payload.designation);
  if (designation && designation.length > 85) throw new Error("Designation must be 85 characters or less.");
  const image = sanitizeExternalOrRelativeUrl(payload.image);
  const linkedinUrl = sanitizeExternalOrRelativeUrl(payload.linkedinUrl);
  const isActive = payload.isActive ?? true;

  if (payload.id && payload.id > 0) {
    const displayOrder = payload.displayOrder ?? 1;
    await pool.execute(
      `UPDATE about_team_members
       SET category = ?, name = ?, designation = ?, image = ?, linkedin_url = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [category, name, designation, image, linkedinUrl, displayOrder, isActive ? 1 : 0, payload.id],
    );
    const updated = await getAboutTeamMemberById(payload.id);
    if (!updated) throw new Error("Failed to find updated team member.");
    return updated;
  }

  let nextOrder = payload.displayOrder;
  if (!nextOrder) {
    const maxRow = await queryRows<AboutTeamMemberDbRow>(
      `SELECT MAX(display_order) as max_order FROM about_team_members WHERE category = ?`,
      [category],
    );
    const currentMax = maxRow[0] && typeof maxRow[0].max_order === "number" ? maxRow[0].max_order : 0;
    nextOrder = currentMax + 1;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO about_team_members (category, name, designation, image, linkedin_url, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [category, name, designation, image, linkedinUrl, nextOrder, isActive ? 1 : 0],
  );

  const inserted = await getAboutTeamMemberById(Number(result.insertId));
  if (!inserted) throw new Error("Failed to retrieve created team member.");
  return inserted;
}

export async function deleteAboutTeamMember(id: number): Promise<boolean> {
  await ensureAboutTeamMembersTable();
  const [result] = await getMysqlPool().execute<ResultSetHeader>(
    `DELETE FROM about_team_members WHERE id = ?`,
    [id],
  );
  return result.affectedRows > 0;
}

export async function updateAboutTeamMembersDisplayOrder(
  items: AboutTeamMemberDisplayOrderItem[],
): Promise<void> {
  await ensureAboutTeamMembersTable();
  const pool = getMysqlPool();
  for (const item of items) {
    await pool.execute(
      `UPDATE about_team_members SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [item.displayOrder, item.id],
    );
  }
}
