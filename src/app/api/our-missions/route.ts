import { getWebsiteOurMissions } from "@/src/lib/website-our-missions";
import type { ApiResponse, OurMissionRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getWebsiteOurMissions();
    return Response.json({
      success: true,
      data,
      message: "Active mission points fetched.",
      error: null,
    } satisfies ApiResponse<OurMissionRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch mission points.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
