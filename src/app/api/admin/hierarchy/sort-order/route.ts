import { assertAdmin, badRequest, ok } from "@/src/lib/admin-api";
import { updateHierarchySortOrder } from "@/src/lib/admin-hierarchy";

type SortOrderPayload = {
  items: Array<{ id: number; sortOrder: number }>;
};

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json()) as SortOrderPayload;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return badRequest("Items array is required.");
    }

    for (const item of body.items) {
      if (typeof item.id !== "number" || typeof item.sortOrder !== "number") {
        return badRequest("Each item must have id and sortOrder as numbers.");
      }
    }

    await updateHierarchySortOrder(body.items);
    return ok("Sort order updated successfully.", { updated: body.items.length });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Unable to update sort order.");
  }
}
