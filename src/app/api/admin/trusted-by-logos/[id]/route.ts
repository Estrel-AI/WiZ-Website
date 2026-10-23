import { assertAdmin, badRequest, notFound, ok } from "@/src/lib/admin-api";
import { deleteTrustedByLogo } from "@/src/lib/admin-trusted-by-logos";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id <= 0) return badRequest("A valid logo id is required.");
  const deleted = await deleteTrustedByLogo(id);
  if (!deleted) return notFound("Trusted By logo not found.");
  return ok("Trusted By logo deleted successfully", { deletedId: id });
}
