import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { listTrustedByLogos } from "@/src/lib/admin-trusted-by-logos";
import type { TrustedByLogoListPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    return ok("Trusted By logos fetched successfully", await listTrustedByLogos((await request.json().catch(() => ({}))) as TrustedByLogoListPayload));
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to list Trusted By logos.");
  }
}
