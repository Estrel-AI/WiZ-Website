import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { updateHomeUseCaseCardDisplayOrder } from "@/src/lib/admin-home-use-case-cards";
import type { HomeUseCaseCardDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as HomeUseCaseCardDisplayOrderPayload;
    const data = await updateHomeUseCaseCardDisplayOrder(body);
    return ok("Home use case display order updated successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update home use case display order.");
  }
}
