import { notFound, ok, serverError } from "@/src/lib/admin-api";
import { getHeroSection } from "@/src/lib/admin-hero-section";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const heroSection = await getHeroSection();
    if (!heroSection) {
      return notFound("Hero section not found.");
    }

    return ok("Hero section fetched successfully", heroSection);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch hero section.";
    return serverError(message);
  }
}
