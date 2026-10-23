import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { queryRows } from "@/src/lib/mysql";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

type PlanCodeDbRow = RowDataPacket & {
  id: number;
  plan_key: string | null;
  plan_code: string | null;
  description: string | null;
  is_active: number | boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

export async function GET(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const rows = await queryRows<PlanCodeDbRow>(
      `SELECT id, plan_key, plan_code, description, is_active, created_at, updated_at
       FROM plan_codes
       ORDER BY plan_key ASC`,
      []
    );

    const result = rows.map((row) => ({
      id: row.id,
      planKey: row.plan_key,
      planCode: row.plan_code,
      description: row.description,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString(),
      updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : new Date(row.updated_at).toISOString(),
    }));

    return ok("Plan codes fetched successfully", { result, count: result.length });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to list plan codes.");
  }
}

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await request.json();
    const { id, planKey, planCode, description, isActive } = body;

    if (!planKey || !planCode) {
      return badRequest("Both planKey and planCode are required.");
    }

    const { getMysqlPool } = await import("@/src/lib/mysql");
    const connection = await getMysqlPool().getConnection();

    try {
      await connection.beginTransaction();

      if (id && Number(id) > 0) {
        // Update existing
        await connection.execute<ResultSetHeader>(
          `UPDATE plan_codes
           SET plan_key = ?, plan_code = ?, description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [planKey.trim(), planCode.trim(), description?.trim() || null, isActive ? 1 : 0, Number(id)]
        );

        await connection.commit();
        return ok("Plan code updated successfully", { id: Number(id), action: "updated" });
      } else {
        // Create new
        const [result] = await connection.execute<ResultSetHeader>(
          `INSERT INTO plan_codes (plan_key, plan_code, description, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [planKey.trim(), planCode.trim(), description?.trim() || null, isActive ? 1 : 0]
        );

        await connection.commit();
        return ok("Plan code created successfully", { id: Number(result.insertId), action: "created" });
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to save plan code.");
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || Number.isNaN(Number(id))) {
      return badRequest("Valid Plan Code ID is required.");
    }

    const { getMysqlPool } = await import("@/src/lib/mysql");
    const connection = await getMysqlPool().getConnection();
    try {
      await connection.execute<ResultSetHeader>(`DELETE FROM plan_codes WHERE id = ?`, [Number(id)]);
      return ok("Plan code deleted successfully", { id: Number(id) });
    } finally {
      connection.release();
    }
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to delete plan code.");
  }
}