import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { bulkDeleteFunctions } from "@/src/lib/admin-hierarchy";
import type { BulkDeletePayload } from "@/src/types/admin-api";

export async function DELETE(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as BulkDeletePayload;
    const deletedIds = await bulkDeleteFunctions(body);
    return ok("Functions deleted successfully", { deletedIds });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to delete functions.");
  }
}
