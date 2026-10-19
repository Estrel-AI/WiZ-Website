import { NextResponse } from "next/server";
import { getSeoMetadataByPageKey } from "@/src/lib/admin-seo-metadata";
import type { ApiResponse, SeoMetadataRow } from "@/src/types/admin-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageKey: string }> },
) {
  try {
    const { pageKey } = await params;
    const data = await getSeoMetadataByPageKey(pageKey);
    if (!data) {
      return NextResponse.json<ApiResponse<SeoMetadataRow | null>>(
        { success: false, message: "SEO metadata not found for this page.", data: null, error: "SEO metadata not found." },
        { status: 404 },
      );
    }
    return NextResponse.json<ApiResponse<SeoMetadataRow>>({
      success: true,
      message: "SEO metadata retrieved successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<SeoMetadataRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load SEO metadata.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to load SEO metadata.",
      },
      { status: 500 },
    );
  }
}
