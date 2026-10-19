import { unstable_noStore as noStore } from "next/cache";
import { getActiveHomeAiAdoptionCards } from "@/src/lib/admin-home-ai-adoption";
import type { HomeAiAdoptionCardRow } from "@/src/types/admin-api";

export async function fetchPublicHomeAiAdoptionCards(): Promise<HomeAiAdoptionCardRow[]> {
  noStore();
  try {
    return await getActiveHomeAiAdoptionCards();
  } catch (error) {
    console.error("Failed to fetch public AI adoption cards:", error);
    return [];
  }
}
