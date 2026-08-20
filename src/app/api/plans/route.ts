import { ok, serverError } from "@/src/lib/admin-api";
import { listPlans } from "@/src/lib/admin-plans";

export async function GET() {
  try {
    const data = await listPlans({
      hide: false,
    });
    return ok("Plans fetched successfully", data);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to load plans.");
  }
}
