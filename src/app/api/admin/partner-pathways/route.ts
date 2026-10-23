import { NextRequest } from "next/server";
import { listPartnerPathways, upsertPartnerPathway } from "@/src/lib/admin-partner-pathways";
import type { ApiResponse, PartnerPathwayRow, PartnerPathwayUpsertPayload } from "@/src/types/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam === null ? undefined : isActiveParam === "true";

    const data = await listPartnerPathways({ search, isActive });
    return Response.json({
      success: true,
      data,
      message: "Partner pathways fetched successfully.",
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PartnerPathwayUpsertPayload;
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

    const item = await upsertPartnerPathway(body);
    return Response.json({
      success: true,
      data: item,
      message: body.id ? "Partner pathway updated successfully." : "Partner pathway created successfully.",
      error: null,
    } satisfies ApiResponse<PartnerPathwayRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to save partner pathway.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
