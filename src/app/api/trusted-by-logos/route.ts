import { ok, serverError } from "@/src/lib/admin-api";
import { listActiveTrustedByLogos } from "@/src/lib/admin-trusted-by-logos";

export async function GET() {
  try {
    return ok("Trusted By logos fetched successfully", await listActiveTrustedByLogos());
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch Trusted By logos.");
  }
}
