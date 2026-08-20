import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { deleteBlog, getBlogById } from "@/src/lib/admin-blog";

function parseBlogId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const blogId = parseBlogId(id);

  if (!blogId) {
    return badRequest("A valid blog id is required.");
  }

  const blog = await getBlogById(blogId);
  if (!blog) {
    return notFound("Blog post not found.");
  }

  return ok("Blog post fetched successfully", blog);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const blogId = parseBlogId(id);

  if (!blogId) {
    return badRequest("A valid blog id is required.");
  }

  const deleted = await deleteBlog(blogId);
  if (!deleted) {
    return notFound("Blog post not found.");
  }

  return ok("Blog post deleted successfully", { deletedId: blogId });
}
