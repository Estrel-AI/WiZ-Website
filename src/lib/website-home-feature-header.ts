import { unstable_noStore as noStore } from "next/cache";
import { getHomeFeatureHeader } from "@/src/lib/admin-home-feature-header";

export const defaultHomeFeatureHeader = {
  id: 0,
  heading: "Everything you need to move from prototype to production",
  description: "WiiZ brings together the core capabilities required to Orchestrate enterprise AI agents at scale.",
  createdAt: "",
  updatedAt: "",
};

export async function fetchPublicHomeFeatureHeader() {
  noStore();
  return (await getHomeFeatureHeader()) ?? defaultHomeFeatureHeader;
}
