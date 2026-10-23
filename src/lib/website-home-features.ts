import { unstable_noStore as noStore } from "next/cache";
import { DEFAULT_HOME_FEATURES, listHomeFeatures } from "@/src/lib/admin-home-features";
import type { HomeFeatureRow } from "@/src/types/admin-api";

export async function fetchPublicHomeFeatures(): Promise<HomeFeatureRow[]> {
  noStore();
  try {
    const data = await listHomeFeatures({
      isActive: true,
    });

    if (data.result && data.result.length > 0) {
      return data.result;
    }
  } catch (error: any) {
    if (error?.code !== "ECONNREFUSED") {
      console.warn("[Website] Failed to fetch home features from DB:", error?.message || error);
    }
  }

  return DEFAULT_HOME_FEATURES.map((item, index) => ({
    id: index + 1,
    label: item.label,
    title: item.title,
    description: item.description,
    features: item.features,
    mediaType: item.mediaType,
    mediaUrl: item.mediaUrl,
    displayOrder: item.displayOrder,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}
