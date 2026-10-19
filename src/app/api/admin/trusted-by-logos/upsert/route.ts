import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { upsertTrustedByLogo } from "@/src/lib/admin-trusted-by-logos";
import type { TrustedByLogoUpsertPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    return ok("Trusted By logo saved successfully", await upsertTrustedByLogo(await request.json() as TrustedByLogoUpsertPayload));
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to save Trusted By logo.");
  }
}
