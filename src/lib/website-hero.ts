import { unstable_noStore as noStore } from "next/cache";
import { getHeroSection } from "@/src/lib/admin-hero-section";

export async function fetchPublicHeroSection() {
  noStore();
  return getHeroSection();
}
