import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { bulkUpsertFunctionsByIndustryGroups } from "@/src/lib/admin-hierarchy";
import type { FunctionBulkUpsertGroup } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as FunctionBulkUpsertGroup[];
    const data = await bulkUpsertFunctionsByIndustryGroups(body);
    return ok("Functions processed successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to upsert functions.");
  }
}
