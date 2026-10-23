import { NextRequest } from "next/server";
import { updatePartnerBenefitsDisplayOrder } from "@/src/lib/admin-partner-benefits";
import type { ApiResponse, PartnerBenefitDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PartnerBenefitDisplayOrderPayload;
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

    await updatePartnerBenefitsDisplayOrder(body.items);
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
