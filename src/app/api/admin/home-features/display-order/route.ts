import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { updateHomeFeatureDisplayOrder } from "@/src/lib/admin-home-features";
import type { HomeFeatureDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as HomeFeatureDisplayOrderPayload;
    const data = await updateHomeFeatureDisplayOrder(body);
    return ok("Feature display order updated successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update feature display order.");
  }
}
