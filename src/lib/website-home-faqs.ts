import { ensureHomeFaqsTable, listHomeFaqs } from "@/src/lib/admin-home-faqs";
import type { HomeFaqRow } from "@/src/types/admin-api";

export async function getWebsiteHomeFaqs(): Promise<HomeFaqRow[]> {
  try {
    await ensureHomeFaqsTable();
    return await listHomeFaqs({ isActive: true });
  } catch (error) {
    console.error("Failed to fetch website home faqs from DB:", error);
    return [];
  }
}
