import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "WiiZ Pricing & Plans | Scale Your Enterprise AI Journey" },
  description: "Compare WiiZ plans and find the best fit for your business. Accelerate AI adoption with enterprise-grade Agentic AI orchestration, security, governance, and expert support.",
  path: "/pricing",
  image: websiteOgImages.pricing,
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
