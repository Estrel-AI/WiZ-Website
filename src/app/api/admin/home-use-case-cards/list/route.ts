import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { listHomeUseCaseCards } from "@/src/lib/admin-home-use-case-cards";
import type { HomeUseCaseCardListPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as HomeUseCaseCardListPayload;
    const data = await listHomeUseCaseCards(body);
    return ok("Home use case cards fetched successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to list home use case cards.");
  }
}
