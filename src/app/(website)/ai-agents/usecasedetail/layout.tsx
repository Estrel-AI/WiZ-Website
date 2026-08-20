import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: "Use Case Details",
  description: "Explore WiiZ use case details for AI workflow orchestration and automation.",
  path: "/ai-agents/usecasedetail",
  image: websiteOgImages.usecase,
});

export default function UseCaseDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
