import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { upsertHomeUseCaseCard } from "@/src/lib/admin-home-use-case-cards";
import type { HomeUseCaseCardUpsertPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as HomeUseCaseCardUpsertPayload;
    const data = await upsertHomeUseCaseCard(body);
    return ok("Home use case card saved successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to save home use case card.");
  }
}
