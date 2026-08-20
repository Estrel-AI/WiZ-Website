import { ok, serverError } from "@/src/lib/admin-api";
import { listHomeFeatures } from "@/src/lib/admin-home-features";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await listHomeFeatures({
      isActive: true,
    });
    return ok("Home features fetched successfully", data);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to load home features.");
  }
}
