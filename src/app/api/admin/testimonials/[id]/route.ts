import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { deleteHomeTestimonial, getHomeTestimonialById } from "@/src/lib/admin-home-testimonials";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const item = await getHomeTestimonialById(Number(id));
    if (!item) return badRequest("Testimonial not found.");
    return ok("Testimonial fetched successfully", item);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch testimonial.");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const success = await deleteHomeTestimonial(Number(id));
    if (!success) return badRequest("Testimonial not found.");
    return ok("Testimonial deleted successfully", { deletedId: Number(id) });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to delete testimonial.");
  }
}
