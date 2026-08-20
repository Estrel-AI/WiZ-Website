import { ok, serverError } from "@/src/lib/admin-api";
import { listPublishedBlogs } from "@/src/lib/admin-blog";

export async function GET() {
  try {
    const rows = await listPublishedBlogs();
    return ok("Published blog posts fetched successfully", {
      result: rows,
      count: rows.length,
    });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch blog posts.");
  }
}
