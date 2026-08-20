import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { listBlogs } from "@/src/lib/admin-blog";
import type { BlogListPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as BlogListPayload;
    const data = await listBlogs(body);
    return ok("Blog posts fetched successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to list blog posts.");
  }
}
