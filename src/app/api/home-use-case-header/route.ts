import { ok, serverError } from "@/src/lib/admin-api";
import { fetchPublicHomeUseCaseHeader } from "@/src/lib/website-home-use-case-header";

export async function GET() {
  try {
    return ok("Home use case header fetched successfully", await fetchPublicHomeUseCaseHeader());
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch home use case header.");
  }
}
