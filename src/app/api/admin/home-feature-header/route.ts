import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { getHomeFeatureHeader, upsertHomeFeatureHeader } from "@/src/lib/admin-home-feature-header";
import type { HomeFeatureHeaderUpsertPayload } from "@/src/types/admin-api";

export async function GET() {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    return ok("Home feature header fetched successfully", await getHomeFeatureHeader());
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch home feature header.");
  }
}

export async function PUT(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    return ok("Home feature header updated successfully", await upsertHomeFeatureHeader(await request.json() as HomeFeatureHeaderUpsertPayload));
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update home feature header.");
  }
}
