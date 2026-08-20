import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "Get Started with WiiZ | Enterprise Agentic AI Platform" },
  description: "Create your WiiZ account and get started with enterprise Agentic AI. Build, orchestrate, monitor, and govern AI agents through a secure, scalable, and enterprise-ready platform.",
  path: "/login",
  image: websiteOgImages.home,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
