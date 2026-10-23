import { NextRequest } from "next/server";
import { updateOurMissionsDisplayOrder } from "@/src/lib/admin-our-missions";
import type { ApiResponse, OurMissionDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OurMissionDisplayOrderPayload;
    if (!Array.isArray(body.items)) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Items array is required.",
          error: "Items array is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    await updateOurMissionsDisplayOrder(body.items);
    return Response.json({
      success: true,
      data: null,
      message: "Display order updated successfully.",
      error: null,
    } satisfies ApiResponse<null>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to update display order.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
