import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { updateTrustedByLogoStatus } from "@/src/lib/admin-trusted-by-logos";
import type { TrustedByLogoStatus } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const body = await request.json() as { id?: number; status?: TrustedByLogoStatus };
    if (!body.id || !body.status || !["active", "inactive"].includes(body.status)) return badRequest("A valid id and status are required.");
    await updateTrustedByLogoStatus(Number(body.id), body.status);
    return ok("Trusted By logo status updated successfully", { id: body.id, status: body.status });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update Trusted By logo status.");
  }
}
