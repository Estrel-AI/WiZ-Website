import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { upsertHomeFeature } from "@/src/lib/admin-home-features";
import type { HomeFeatureUpsertPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as HomeFeatureUpsertPayload;
    const data = await upsertHomeFeature(body);
    return ok("Home feature saved successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to save home feature.");
  }
}
