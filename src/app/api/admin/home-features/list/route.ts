import { assertAdmin, ok, serverError } from "@/src/lib/admin-api";
import { listHomeFeatures } from "@/src/lib/admin-home-features";
import type { HomeFeatureListPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as HomeFeatureListPayload;
    const data = await listHomeFeatures(body);
    return ok("Home features fetched successfully", data);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to list home features.");
  }
}
