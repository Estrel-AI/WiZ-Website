import { unstable_noStore as noStore } from "next/cache";
import { DEFAULT_TESTIMONIALS, listHomeTestimonials } from "@/src/lib/admin-home-testimonials";
import type { HomeTestimonialRow } from "@/src/types/admin-api";

export async function fetchPublicHomeTestimonials(): Promise<HomeTestimonialRow[]> {
  noStore();
  try {
    const data = await listHomeTestimonials({ isActive: true });
    if (data.result.length > 0) {
      return data.result;
    }
  } catch (error) {
    console.error("Error fetching public home testimonials:", error);
  }

  return DEFAULT_TESTIMONIALS.map((item, index) => ({
    id: index + 1,
    name: item.name,
    role: item.role,
    image: item.image,
    quote: item.quote,
    displayOrder: item.displayOrder,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}
