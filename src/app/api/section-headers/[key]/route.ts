import { ok, serverError } from "@/src/lib/admin-api";
import { fetchPublicSectionHeader } from "@/src/lib/website-section-headers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const { key } = await params;
    const data = await fetchPublicSectionHeader(key);
    return ok("Section header fetched successfully", data);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch section header.");
  }
}
