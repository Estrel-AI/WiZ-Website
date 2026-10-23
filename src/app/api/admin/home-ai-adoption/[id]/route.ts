import { NextResponse } from "next/server";
import {
  deleteHomeAiAdoptionCard,
  getHomeAiAdoptionCardById,
} from "@/src/lib/admin-home-ai-adoption";
import type { ApiResponse, HomeAiAdoptionCardRow } from "@/src/types/admin-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cardId = Number.parseInt(id, 10);
    if (Number.isNaN(cardId)) {
      return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow | null>>(
        { success: false, message: "Invalid card ID.", data: null, error: "Invalid card ID." },
        { status: 400 },
      );
    }

    const data = await getHomeAiAdoptionCardById(cardId);
    if (!data) {
      return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow | null>>(
        { success: false, message: "Card not found.", data: null, error: "Card not found." },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow>>({
      success: true,
      message: "Card retrieved successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<HomeAiAdoptionCardRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch card.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to fetch card.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const cardId = Number.parseInt(id, 10);
    if (Number.isNaN(cardId)) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Invalid card ID.", data: false, error: "Invalid card ID." },
        { status: 400 },
      );
    }

    const deleted = await deleteHomeAiAdoptionCard(cardId);
    if (!deleted) {
      return NextResponse.json<ApiResponse<boolean>>(
        { success: false, message: "Card not found or already deleted.", data: false, error: "Card not found or already deleted." },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<boolean>>({
      success: true,
      message: "Card deleted successfully.",
      data: true,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<boolean>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete card.",
        data: false,
        error: error instanceof Error ? error.message : "Failed to delete card.",
      },
      { status: 500 },
    );
  }
}
