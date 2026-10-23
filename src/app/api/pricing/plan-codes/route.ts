import { ok, serverError } from "@/src/lib/admin-api";
import { listPlanCodes } from "@/src/lib/admin-plan-codes";

export async function GET() {
  try {
    const rows = await listPlanCodes();

    // Convert to a key-value map for frontend consumption
    const planCodes: Record<string, string> = {};
    for (const row of rows) {
      if (row.planKey && row.planCode) {
        planCodes[row.planKey] = row.planCode;
      }
    }

    return ok("Plan codes fetched successfully", { planCodes });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to load plan codes.");
  }
}