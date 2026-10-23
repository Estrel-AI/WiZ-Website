import { NextRequest } from "next/server";
import { listOurMissions, upsertOurMission } from "@/src/lib/admin-our-missions";
import type { ApiResponse, OurMissionRow, OurMissionUpsertPayload } from "@/src/types/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam === null ? undefined : isActiveParam === "true";

    const data = await listOurMissions({ search, isActive });
    return Response.json({
      success: true,
      data,
      message: "Mission items fetched successfully.",
      error: null,
    } satisfies ApiResponse<OurMissionRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch mission items.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OurMissionUpsertPayload;
    if (!body.content?.trim()) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Content is required.",
          error: "Content is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const item = await upsertOurMission(body);
    return Response.json({
      success: true,
      data: item,
      message: body.id ? "Mission item updated successfully." : "Mission item created successfully.",
      error: null,
    } satisfies ApiResponse<OurMissionRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to save mission item.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
