import { unstable_noStore as noStore } from "next/cache";
import { readAdminCmsData } from "@/src/lib/admin-cms";

export async function readWebsiteCmsData() {
  noStore();
  return readAdminCmsData();
}
