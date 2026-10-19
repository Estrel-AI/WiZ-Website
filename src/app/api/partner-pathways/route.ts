import { getWebsitePartnerPathways } from "@/src/lib/website-partner-pathways";
import type { ApiResponse, PartnerPathwayRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getWebsitePartnerPathways();
    return Response.json({
      success: true,
      data,
      message: "Active partner pathways fetched.",
      error: null,
    } satisfies ApiResponse<PartnerPathwayRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch partner pathways.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
