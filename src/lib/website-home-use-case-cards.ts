import { unstable_noStore as noStore } from "next/cache";
import { listPublicHomeUseCaseCards } from "@/src/lib/admin-home-use-case-cards";

export async function fetchPublicHomeUseCaseCards() {
  noStore();
  return listPublicHomeUseCaseCards();
}
