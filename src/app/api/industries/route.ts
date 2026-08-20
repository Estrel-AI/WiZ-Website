import { ok } from "@/src/lib/admin-api";
import { listHierarchy } from "@/src/lib/admin-hierarchy";

export async function GET() {
  const data = await listHierarchy({
    type: "industry",
    page: 1,
    limit: 100,
    sortBy: "title",
    sortOrder: "asc",
  });

  return ok("Industries fetched successfully", data);
}
