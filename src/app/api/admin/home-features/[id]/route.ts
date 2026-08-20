import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { deleteHomeFeature, getHomeFeatureById } from "@/src/lib/admin-home-features";

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
  const featureId = Number(id);

  if (!Number.isInteger(featureId) || featureId <= 0) {
    return badRequest("A valid home feature id is required.");
  }

  const feature = await getHomeFeatureById(featureId);
  if (!feature) {
    return notFound("Home feature not found.");
  }

  return ok("Home feature fetched successfully", feature);
}

export async function DELETE(_: Request, context: RouteContext) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const featureId = Number(id);

  if (!Number.isInteger(featureId) || featureId <= 0) {
    return badRequest("A valid home feature id is required.");
  }

  const deleted = await deleteHomeFeature(featureId);
  if (!deleted) {
    return notFound("Home feature not found.");
  }

  return ok("Home feature deleted successfully", { deletedId: featureId });
}
