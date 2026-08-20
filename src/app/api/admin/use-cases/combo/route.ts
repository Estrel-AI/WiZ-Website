import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { listUseCaseCombo } from "@/src/lib/admin-hierarchy";

export async function GET(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const data = await listUseCaseCombo(search);
    return ok("Use case options fetched successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to load use case options.");
  }
}
