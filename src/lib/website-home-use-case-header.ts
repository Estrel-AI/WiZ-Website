import { unstable_noStore as noStore } from "next/cache";
import { getHomeUseCaseHeader } from "@/src/lib/admin-home-use-case-header";

export const defaultHomeUseCaseHeader = {
  id: 0,
  badgeText: "Use Cases",
  heading: "Leaderboard of WiiZ Built AI Agents",
  description: "Examples of AI agents built on WiiZ for real enterprise workflows.",
  buttonText: "View All Agents",
  buttonUrl: "/ai-agents",
  createdAt: "",
  updatedAt: "",
};

export async function fetchPublicHomeUseCaseHeader() {
  noStore();
  return (await getHomeUseCaseHeader()) ?? defaultHomeUseCaseHeader;
}
