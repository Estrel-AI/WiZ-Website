import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { getHomeUseCaseHeader, upsertHomeUseCaseHeader } from "@/src/lib/admin-home-use-case-header";
import type { HomeUseCaseHeaderUpsertPayload } from "@/src/types/admin-api";

export async function GET() {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    return ok("Home use case header fetched successfully", await getHomeUseCaseHeader());
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch home use case header.");
  }
}

export async function PUT(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    return ok("Home use case header updated successfully", await upsertHomeUseCaseHeader(await request.json() as HomeUseCaseHeaderUpsertPayload));
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update home use case header.");
  }
}
