import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { bulkUpsertIndustries } from "@/src/lib/admin-hierarchy";
import type { IndustryBulkUpsertPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as IndustryBulkUpsertPayload;
    const data = await bulkUpsertIndustries(body.items ?? []);
    return ok("Industries processed successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to upsert industries.");
  }
}
