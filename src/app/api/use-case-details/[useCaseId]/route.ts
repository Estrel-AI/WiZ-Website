import { badRequest, notFound, ok } from "@/src/lib/admin-api";
import { listUseCaseDetailsByUseCase } from "@/src/lib/admin-hierarchy";

type RouteContext = {
  params: Promise<{
    useCaseId: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { useCaseId } = await context.params;
  const parsedUseCaseId = Number(useCaseId);

  if (!Number.isInteger(parsedUseCaseId) || parsedUseCaseId <= 0) {
    return badRequest("A valid use case id is required.");
  }

  const result = await listUseCaseDetailsByUseCase(parsedUseCaseId);
  if (!result) {
    return notFound("Use case not found.");
  }

  return ok("Use case details fetched successfully", result);
}
