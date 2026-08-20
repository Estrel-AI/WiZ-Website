import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { bulkDeleteIndustries } from "@/src/lib/admin-hierarchy";
import type { BulkDeletePayload } from "@/src/types/admin-api";

export async function DELETE(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as BulkDeletePayload;
    const deletedIds = await bulkDeleteIndustries(body);
    return ok("Industries deleted successfully", { deletedIds });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to delete industries.");
  }
}
