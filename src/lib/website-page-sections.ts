import {
  ensurePageSectionsTable,
  getDefaultPageSectionKeys,
  getFallbackPageSectionKeys,
  listPageSectionKeys,
} from "@/src/lib/admin-page-sections";

export async function getWebsitePageSectionKeys(pageKey: string): Promise<string[]> {
  try {
    await ensurePageSectionsTable();
    const keys = await listPageSectionKeys(pageKey);
    return keys.length > 0 ? keys : getDefaultPageSectionKeys(pageKey);
  } catch (error) {
    console.error(`Failed to fetch website page section order for "${pageKey}":`, error);
    return getFallbackPageSectionKeys(pageKey);
  }
}