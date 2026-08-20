import { ok, serverError } from "@/src/lib/admin-api";
import { listPublicHomeUseCaseCards } from "@/src/lib/admin-home-use-case-cards";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await listPublicHomeUseCaseCards();
    return ok("Home use case cards fetched successfully", data);
  } catch (error) {
    return serverError(
      error instanceof Error ? error.message : "Unable to load home use case cards.",
    );
  }
}
