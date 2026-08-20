import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "Contact WiiZ | Talk to Our Enterprise Agentic AI Experts" },
  description: "Connect with the WiiZ team to explore Enterprise Agentic AI solutions. Schedule a demo, discuss your business requirements, and discover how WiiZ can accelerate your AI transformation journey.",
  path: "/contact",
  image: websiteOgImages.contact,
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
