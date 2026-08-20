import { unstable_noStore as noStore } from "next/cache";
import { listHomeFeatures } from "@/src/lib/admin-home-features";

export async function fetchPublicHomeFeatures() {
  noStore();
  const data = await listHomeFeatures({
    isActive: true,
  });

  return data.result;
}
