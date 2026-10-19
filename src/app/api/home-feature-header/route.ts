import { ok, serverError } from "@/src/lib/admin-api";
import { fetchPublicHomeFeatureHeader } from "@/src/lib/website-home-feature-header";

export async function GET() {
  try {
    return ok("Home feature header fetched successfully", await fetchPublicHomeFeatureHeader());
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch home feature header.");
  }
}
