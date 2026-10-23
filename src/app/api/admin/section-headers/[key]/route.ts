import { assertAdmin, badRequest, ok, serverError } from "@/src/lib/admin-api";
import { getSectionHeader, upsertSectionHeader } from "@/src/lib/admin-section-headers";
import type { SectionHeaderUpsertPayload } from "@/src/types/admin-api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const { key } = await params;
    const data = await getSectionHeader(key);
    return ok("Section header fetched successfully", data);
  } catch (error) {
    return serverError(error instanceof Error ? error.message : "Unable to fetch section header.");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;
  try {
    const { key } = await params;
    const payload = (await request.json()) as SectionHeaderUpsertPayload;
    await upsertSectionHeader(key, payload);
    const data = await getSectionHeader(key);
    return ok("Section header updated successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update section header.");
  }
}

export { PUT as POST };
