import { NextRequest } from "next/server";
import { deletePartnerPathway, getPartnerPathwayById } from "@/src/lib/admin-partner-pathways";
import type { ApiResponse, PartnerPathwayRow } from "@/src/types/admin-api";

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

    const item = await getPartnerPathwayById(id);
    if (!item) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Partner pathway not found.",
          error: "Partner pathway not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: item,
      message: "Partner pathway retrieved.",
      error: null,
    } satisfies ApiResponse<PartnerPathwayRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch partner pathway.",
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

    const success = await deletePartnerPathway(id);
    if (!success) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Partner pathway not found or already deleted.",
          error: "Partner pathway not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: null,
      message: "Partner pathway deleted successfully.",
      error: null,
    } satisfies ApiResponse<null>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to delete partner pathway.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
