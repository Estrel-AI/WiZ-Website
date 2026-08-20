import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "Partner with WiiZ | Enterprise Agentic AI Partner Program" },
  description: "Join the WiiZ Partner Program and help organizations accelerate AI adoption. Collaborate on enterprise Agentic AI solutions, expand your offerings, and unlock new business opportunities with WiiZ.",
  path: "/partner",
  image: websiteOgImages.partner,
});

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
