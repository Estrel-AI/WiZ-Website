import { NextResponse } from "next/server";
import {
  getAllHomeAiAdoptionCardsAdmin,
  upsertHomeAiAdoptionCard,
} from "@/src/lib/admin-home-ai-adoption";
import type { ApiResponse, HomeAiAdoptionCardRow, HomeAiAdoptionCardUpsertPayload } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getAllHomeAiAdoptionCardsAdmin();
    return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow[]>>({
      success: true,
      message: "AI adoption cards retrieved successfully.",
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HomeAiAdoptionCardUpsertPayload;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow | null>>(
        { success: false, message: "Card title is required.", data: null, error: "Card title is required." },
        { status: 400 },
      );
    }

    if (!body.description || !body.description.trim()) {
      return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow | null>>(
        { success: false, message: "Description is required.", data: null, error: "Description is required." },
        { status: 400 },
      );
    }

    const data = await upsertHomeAiAdoptionCard(body);
    return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow>>({
      success: true,
      message: body.id ? "Card updated successfully." : "Card created successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to save AI adoption card.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to save AI adoption card.",
      },
      { status: 500 },
    );
  }
}
