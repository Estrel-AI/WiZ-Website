import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { upsertBlog } from "@/src/lib/admin-blog";
import type { BlogUpsertPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as BlogUpsertPayload;
    const data = await upsertBlog(body);
    return ok("Blog post saved successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to save blog post.");
  }
}
