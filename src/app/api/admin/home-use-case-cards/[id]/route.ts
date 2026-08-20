import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { deleteHomeUseCaseCard, getHomeUseCaseCardById } from "@/src/lib/admin-home-use-case-cards";

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
  const rowId = Number(id);

  if (!Number.isInteger(rowId) || rowId <= 0) {
    return badRequest("A valid home use case card id is required.");
  }

  const row = await getHomeUseCaseCardById(rowId);
  if (!row) {
    return notFound("Home use case card not found.");
  }

  return ok("Home use case card fetched successfully", row);
}

export async function DELETE(_: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const rowId = Number(id);

  if (!Number.isInteger(rowId) || rowId <= 0) {
    return badRequest("A valid home use case card id is required.");
  }

  const deleted = await deleteHomeUseCaseCard(rowId);
  if (!deleted) {
    return notFound("Home use case card not found.");
  }

  return ok("Home use case card deleted successfully", { deletedId: rowId });
}
