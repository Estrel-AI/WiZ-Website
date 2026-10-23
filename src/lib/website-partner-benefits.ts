import { ensurePartnerBenefitsTable, listPartnerBenefits } from "@/src/lib/admin-partner-benefits";
import type { PartnerBenefitRow } from "@/src/types/admin-api";

export async function getWebsitePartnerBenefits(): Promise<PartnerBenefitRow[]> {
  try {
    await ensurePartnerBenefitsTable();
    return await listPartnerBenefits({ isActive: true });
  } catch (error) {
    console.error("Failed to fetch website partner benefits:", error);
    return [];
  }
}
