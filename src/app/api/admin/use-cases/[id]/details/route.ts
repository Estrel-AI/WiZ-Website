import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { listUseCaseDetailsByUseCase } from "@/src/lib/admin-hierarchy";

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
  const useCaseId = Number(id);

  if (!Number.isInteger(useCaseId) || useCaseId <= 0) {
    return badRequest("A valid use case id is required.");
  }

  const result = await listUseCaseDetailsByUseCase(useCaseId);
  if (!result) {
    return notFound("Use case not found.");
  }

  return ok("Use case details fetched successfully", result);
}
