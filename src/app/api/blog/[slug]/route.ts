import { badRequest, notFound, ok, serverError } from "@/src/lib/admin-api";
import { getPublishedBlogBySlug } from "@/src/lib/admin-blog";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    if (!slug?.trim()) {
      return badRequest("A valid blog slug is required.");
    }

    const row = await getPublishedBlogBySlug(slug);
    if (!row) {
      return notFound("Blog post not found.");
    }

    return ok("Published blog post fetched successfully", row);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch blog post.");
  }
}
