import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { updateHomeTestimonialDisplayOrder } from "@/src/lib/admin-home-testimonials";
import type { HomeTestimonialDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const payload = (await request.json()) as HomeTestimonialDisplayOrderPayload;
    if (!payload || !Array.isArray(payload.items)) {
      return badRequest("Invalid display order payload.");
    }
    const result = await updateHomeTestimonialDisplayOrder(payload);
    return ok("Display order updated successfully", result);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to update display order.");
  }
}
