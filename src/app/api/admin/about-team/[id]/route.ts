import { NextRequest } from "next/server";
import { deleteAboutTeamMember, getAboutTeamMemberById } from "@/src/lib/admin-about-team";
import type { AboutTeamMemberRow, ApiResponse } from "@/src/types/admin-api";

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

    const item = await getAboutTeamMemberById(id);
    if (!item) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Team member not found.",
          error: "Team member not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: item,
      message: "Team member retrieved.",
      error: null,
    } satisfies ApiResponse<AboutTeamMemberRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch team member.",
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

    const success = await deleteAboutTeamMember(id);
    if (!success) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Team member not found or already deleted.",
          error: "Team member not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: null,
      message: "Team member deleted successfully.",
      error: null,
    } satisfies ApiResponse<null>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to delete team member.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
