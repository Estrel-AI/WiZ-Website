import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { deleteUseCaseDetail, listUseCaseDetailsByUseCase } from "@/src/lib/admin-hierarchy";

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

  return ok("Use case detail rows fetched successfully", {
    result: result.details,
    count: result.details.length,
  });
}

export async function DELETE(_: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const detailId = Number(id);

  if (!Number.isInteger(detailId) || detailId <= 0) {
    return badRequest("A valid use case detail id is required.");
  }

  const deleted = await deleteUseCaseDetail(detailId);
  if (!deleted) {
    return notFound("Use case detail row not found.");
  }

  return ok("Use case detail row deleted successfully", { deletedId: detailId });
}
