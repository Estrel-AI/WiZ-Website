import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { listHierarchy } from "@/src/lib/admin-hierarchy";
import type { HierarchyListPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as HierarchyListPayload;
    const data = await listHierarchy({
      ...body,
      type: "function",
    });
    return ok("Functions fetched successfully", data);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to list functions.");
  }
}
