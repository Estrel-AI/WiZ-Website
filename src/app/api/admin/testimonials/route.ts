import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { listHomeTestimonials, upsertHomeTestimonial } from "@/src/lib/admin-home-testimonials";
import type { HomeTestimonialUpsertPayload } from "@/src/types/admin-api";

export async function GET(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const data = await listHomeTestimonials({ search, isActive: true });
    return ok("Testimonials fetched successfully", data);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch testimonials.");
  }
}

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const payload = (await request.json()) as HomeTestimonialUpsertPayload;
    const result = await upsertHomeTestimonial(payload);
    return ok("Testimonial saved successfully", result);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to save testimonial.");
  }
}
