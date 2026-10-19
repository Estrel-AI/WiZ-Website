import { ensurePartnerPathwaysTable, listPartnerPathways } from "@/src/lib/admin-partner-pathways";
import type { PartnerPathwayRow } from "@/src/types/admin-api";

export async function getWebsitePartnerPathways(): Promise<PartnerPathwayRow[]> {
  try {
    await ensurePartnerPathwaysTable();
    return await listPartnerPathways({ isActive: true });
  } catch (error) {
    console.error("Failed to fetch website partner pathways:", error);
    return [];
  }
}
