import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { listPlans } from "@/src/lib/admin-plans";
import type { PlanListPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as PlanListPayload;
    const data = await listPlans(body);
    return ok("Plans fetched successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to list plans.");
  }
}
