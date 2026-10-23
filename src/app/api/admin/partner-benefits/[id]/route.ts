import { NextRequest } from "next/server";
import { deletePartnerBenefit, getPartnerBenefitById } from "@/src/lib/admin-partner-benefits";
import type { ApiResponse, PartnerBenefitRow } from "@/src/types/admin-api";

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

    const item = await getPartnerBenefitById(id);
    if (!item) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Partner benefit not found.",
          error: "Partner benefit not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: item,
      message: "Partner benefit retrieved.",
      error: null,
    } satisfies ApiResponse<PartnerBenefitRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch partner benefit.",
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

    const success = await deletePartnerBenefit(id);
    if (!success) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Partner benefit not found or already deleted.",
          error: "Partner benefit not found.",
        } satisfies ApiResponse<null>,
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: null,
      message: "Partner benefit deleted successfully.",
      error: null,
    } satisfies ApiResponse<null>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to delete partner benefit.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
