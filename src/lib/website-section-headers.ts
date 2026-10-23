import { unstable_noStore as noStore } from "next/cache";
import { DEFAULT_SECTION_HEADERS, getSectionHeader } from "@/src/lib/admin-section-headers";
import type { SectionHeaderData, SectionHeaderKey } from "@/src/types/admin-api";

export async function fetchPublicSectionHeader(key: SectionHeaderKey | string): Promise<SectionHeaderData> {
  noStore();
  const normalizedKey = key.trim().toUpperCase();
  const header = await getSectionHeader(normalizedKey);

  if (header) {
    return header;
  }

  const fallback = DEFAULT_SECTION_HEADERS[normalizedKey];
  return {
    id: 0,
    sectionKey: normalizedKey,
    badgeText: fallback?.badgeText ?? null,
    heading: fallback?.heading ?? "Section Heading",
    description: fallback?.description ?? null,
    buttonText: fallback?.buttonText ?? null,
    buttonUrl: fallback?.buttonUrl ?? null,
    backgroundImage: fallback?.backgroundImage ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
