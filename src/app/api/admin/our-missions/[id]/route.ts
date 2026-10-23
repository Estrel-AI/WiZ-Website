import { NextRequest } from "next/server";
import { deleteOurMission, getOurMissionById } from "@/src/lib/admin-our-missions";
import type { ApiResponse, OurMissionRow } from "@/src/types/admin-api";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Invalid ID parameter.",
          error: "Invalid ID parameter.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const item = await getOurMissionById(id);
    if (!item) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Mission item not found.",
          error: "Mission item not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: item,
      message: "Mission item retrieved.",
      error: null,
    } satisfies ApiResponse<OurMissionRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch mission item.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);
    if (!id || isNaN(id)) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Invalid ID parameter.",
          error: "Invalid ID parameter.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const success = await deleteOurMission(id);
    if (!success) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Mission item not found or already deleted.",
          error: "Mission item not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: null,
      message: "Mission item deleted successfully.",
      error: null,
    } satisfies ApiResponse<null>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to delete mission item.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
