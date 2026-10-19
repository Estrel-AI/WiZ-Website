import { getSectionHeader, upsertSectionHeader } from "@/src/lib/admin-section-headers";
import type { HomeUseCaseHeader, HomeUseCaseHeaderUpsertPayload } from "@/src/types/admin-api";

export async function getHomeUseCaseHeader(): Promise<HomeUseCaseHeader | null> {
  const data = await getSectionHeader("USE_CASE");
  if (!data) return null;
  return {
    id: data.id,
    badgeText: data.badgeText ?? "USE CASES",
    heading: data.heading,
    description: data.description ?? "",
    buttonText: data.buttonText ?? "View All Agents",
    buttonUrl: data.buttonUrl ?? "/ai-agents",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function upsertHomeUseCaseHeader(payload: HomeUseCaseHeaderUpsertPayload) {
  const result = await upsertSectionHeader("USE_CASE", {
    badgeText: payload.badgeText,
    heading: payload.heading,
    description: payload.description,
    buttonText: payload.buttonText,
    buttonUrl: payload.buttonUrl,
  });
  return { id: result.id, action: "updated" as const };
}
