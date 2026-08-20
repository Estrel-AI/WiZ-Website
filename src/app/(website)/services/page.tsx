import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: "Services",
  description: "Explore the services and solutions available through WiiZ.",
  path: "/services",
  image: websiteOgImages.home,
});

export default function ServicesPage() {
  return (
    <main>
      <h1>Services</h1>
      <p>List your services here.</p>
    </main>
  );
}
