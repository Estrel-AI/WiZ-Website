import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { deleteUseCase } from "@/src/lib/admin-hierarchy";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const useCaseId = Number(id);

  if (!Number.isInteger(useCaseId) || useCaseId <= 0) {
    return badRequest("A valid use case id is required.");
  }

  try {
    await deleteUseCase(useCaseId);
    return ok("Use case deleted successfully", { deletedId: useCaseId });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to delete use case.");
  }
}
