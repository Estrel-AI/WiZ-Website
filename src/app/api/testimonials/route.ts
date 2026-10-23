import { ok, serverError } from "@/src/lib/admin-api";
import { fetchPublicHomeTestimonials } from "@/src/lib/website-home-testimonials";

export async function GET() {
  try {
    const items = await fetchPublicHomeTestimonials();
    return ok("Testimonials fetched successfully", items);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch testimonials.");
  }
}
