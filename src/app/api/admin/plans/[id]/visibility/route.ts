import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { updatePlanVisibility } from "@/src/lib/admin-plans";
import type { PlanVisibilityPayload } from "@/src/types/admin-api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const planId = Number(id);

  if (!Number.isInteger(planId) || planId <= 0) {
    return badRequest("A valid plan id is required.");
  }

  try {
    const body = (await request.json()) as PlanVisibilityPayload;

    if (typeof body.show !== "boolean") {
      return badRequest("show must be a boolean.");
    }

    const updated = await updatePlanVisibility(planId, body.show);
    if (!updated) {
      return notFound("Plan not found.");
    }

    return ok("Plan visibility updated successfully", { id: planId, show: body.show });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update plan visibility.");
  }
}

