import { getSectionHeader, upsertSectionHeader } from "@/src/lib/admin-section-headers";
import type { HomeFeatureHeader, HomeFeatureHeaderUpsertPayload } from "@/src/types/admin-api";

export async function getHomeFeatureHeader(): Promise<HomeFeatureHeader | null> {
  const data = await getSectionHeader("FEATURE");
  if (!data) return null;
  return {
    id: data.id,
    heading: data.heading,
    description: data.description ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function upsertHomeFeatureHeader(payload: HomeFeatureHeaderUpsertPayload) {
  const result = await upsertSectionHeader("FEATURE", {
    heading: payload.heading,
    description: payload.description,
  });
  return { id: result.id, action: "updated" as const };
}
