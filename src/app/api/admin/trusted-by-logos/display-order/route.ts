import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { updateTrustedByLogoOrder } from "@/src/lib/admin-trusted-by-logos";
import type { TrustedByLogoDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const payload = await request.json() as TrustedByLogoDisplayOrderPayload;
    await updateTrustedByLogoOrder(payload);
    return ok("Trusted By logo order updated successfully", { updatedCount: payload.items.length });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update Trusted By logo order.");
  }
}
