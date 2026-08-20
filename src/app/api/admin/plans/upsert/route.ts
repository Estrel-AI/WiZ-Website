import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { upsertPlan } from "@/src/lib/admin-plans";
import type { PlanUpsertPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as PlanUpsertPayload;
    const data = await upsertPlan(body);
    return ok("Plan saved successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to save plan.");
  }
}
