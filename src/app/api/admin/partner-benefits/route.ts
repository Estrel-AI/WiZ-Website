import { NextRequest } from "next/server";
import { listPartnerBenefits, upsertPartnerBenefit } from "@/src/lib/admin-partner-benefits";
import type { ApiResponse, PartnerBenefitRow, PartnerBenefitUpsertPayload } from "@/src/types/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam === null ? undefined : isActiveParam === "true";

    const data = await listPartnerBenefits({ search, isActive });
    return Response.json({
      success: true,
      data,
      message: "Partner benefits fetched successfully.",
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PartnerBenefitUpsertPayload;
    if (!body.title?.trim() || !body.description?.trim()) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Title and Description are required.",
          error: "Title and Description are required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    if (!body.image?.trim()) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Benefit Image is required.",
          error: "Image is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const item = await upsertPartnerBenefit(body);
    return Response.json({
      success: true,
      data: item,
      message: body.id ? "Partner benefit updated successfully." : "Partner benefit created successfully.",
      error: null,
    } satisfies ApiResponse<PartnerBenefitRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to save partner benefit.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
