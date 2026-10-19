import { getWebsitePartnerBenefits } from "@/src/lib/website-partner-benefits";
import type { ApiResponse, PartnerBenefitRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getWebsitePartnerBenefits();
    return Response.json({
      success: true,
      data,
      message: "Active partner benefits fetched.",
      error: null,
    } satisfies ApiResponse<PartnerBenefitRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch partner benefits.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
