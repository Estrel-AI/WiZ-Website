import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "Pre-Built Enterprise AI Agent | by WiiZ and Partners" },
  description: "Explore enterprise AI Agents across industries. Discover how WiiZ helps organizations automate workflows, orchestrate AI agents, improve decision-making, and drive measurable business outcomes.",
  path: "/ai-agents",
  image: websiteOgImages.usecase,
});

export default function UseCaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
