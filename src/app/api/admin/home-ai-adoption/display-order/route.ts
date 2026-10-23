import { NextResponse } from "next/server";
import { updateHomeAiAdoptionCardsDisplayOrder } from "@/src/lib/admin-home-ai-adoption";
import type { ApiResponse, HomeAiAdoptionCardDisplayOrderPayload } from "@/src/types/admin-api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HomeAiAdoptionCardDisplayOrderPayload;

    if (!Array.isArray(body.items)) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Items array is required.", data: false, error: "Items array is required." },
        { status: 400 },
      );
    }

    await updateHomeAiAdoptionCardsDisplayOrder(body.items);
    return NextResponse.json<ApiResponse<boolean>>({
      success: true,
      message: "Display order updated successfully.",
      data: true,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<boolean>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update display order.",
        data: false,
        error: error instanceof Error ? error.message : "Failed to update display order.",
      },
      { status: 500 },
    );
  }
}
