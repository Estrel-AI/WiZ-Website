import { ensureOurMissionsTable, listOurMissions } from "@/src/lib/admin-our-missions";
import type { OurMissionRow } from "@/src/types/admin-api";

export async function getWebsiteOurMissions(): Promise<OurMissionRow[]> {
  try {
    await ensureOurMissionsTable();
    return await listOurMissions({ isActive: true });
  } catch (error) {
    console.error("Failed to fetch website our missions from DB:", error);
    return [];
  }
}
