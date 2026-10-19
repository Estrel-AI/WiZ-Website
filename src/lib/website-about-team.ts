import { ensureAboutTeamMembersTable, listAboutTeamMembers } from "@/src/lib/admin-about-team";
import type { AboutTeamCategory, AboutTeamMemberRow } from "@/src/types/admin-api";

export async function getWebsiteAboutTeamMembers(
  category: AboutTeamCategory,
): Promise<AboutTeamMemberRow[]> {
  try {
    await ensureAboutTeamMembersTable();
    return await listAboutTeamMembers({ category, isActive: true });
  } catch (error) {
    console.error(`Failed to fetch website ${category} team members:`, error);
    return [];
  }
}
