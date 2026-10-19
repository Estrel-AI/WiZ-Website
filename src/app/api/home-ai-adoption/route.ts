import { NextResponse } from "next/server";
import { getActiveHomeAiAdoptionCards } from "@/src/lib/admin-home-ai-adoption";
import type { ApiResponse, HomeAiAdoptionCardRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getActiveHomeAiAdoptionCards();
    return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow[]>>({
      success: true,
      message: "Active AI adoption cards retrieved.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow[]>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load AI adoption cards.",
        data: [],
        error: error instanceof Error ? error.message : "Failed to load AI adoption cards.",
      },
      { status: 500 },
    );
  }
}
