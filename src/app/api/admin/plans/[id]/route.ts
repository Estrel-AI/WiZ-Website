import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { deletePlan, getPlanById } from "@/src/lib/admin-plans";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const planId = Number(id);

  if (!Number.isInteger(planId) || planId <= 0) {
    return badRequest("A valid plan id is required.");
  }

  const plan = await getPlanById(planId);
  if (!plan) {
    return notFound("Plan not found.");
  }

  return ok("Plan fetched successfully", plan);
}

export async function DELETE(_: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const planId = Number(id);

  if (!Number.isInteger(planId) || planId <= 0) {
    return badRequest("A valid plan id is required.");
  }

  const deleted = await deletePlan(planId);
  if (!deleted) {
    return notFound("Plan not found.");
  }

  return ok("Plan deleted successfully", { deletedId: planId });
}
