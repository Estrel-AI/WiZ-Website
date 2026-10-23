import { NextResponse } from "next/server";
import {
  getAllSeoMetadataAdmin,
  upsertSeoMetadata,
} from "@/src/lib/admin-seo-metadata";
import type { ApiResponse, SeoMetadataRow, SeoMetadataUpsertPayload } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getAllSeoMetadataAdmin();
    return NextResponse.json<ApiResponse<SeoMetadataRow[]>>({
      success: true,
      message: "SEO metadata retrieved successfully.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<SeoMetadataRow[]>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load SEO metadata.",
        data: [],
        error: error instanceof Error ? error.message : "Failed to load SEO metadata.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SeoMetadataUpsertPayload;

    if (!body.pageKey || !body.pageKey.trim()) {
      return NextResponse.json<ApiResponse<SeoMetadataRow | null>>(
        { success: false, message: "Page key is required.", data: null, error: "Page key is required." },
        { status: 400 },
      );
    }

    if (!body.metaTitle || !body.metaTitle.trim()) {
      return NextResponse.json<ApiResponse<SeoMetadataRow | null>>(
        { success: false, message: "Meta title is required.", data: null, error: "Meta title is required." },
        { status: 400 },
      );
    }

    if (!body.metaDescription || !body.metaDescription.trim()) {
      return NextResponse.json<ApiResponse<SeoMetadataRow | null>>(
        { success: false, message: "Meta description is required.", data: null, error: "Meta description is required." },
        { status: 400 },
      );
    }

    const data = await upsertSeoMetadata(body);
    return NextResponse.json<ApiResponse<SeoMetadataRow>>({
      success: true,
      message: `SEO metadata for "${data.pageName}" updated successfully.`,
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<SeoMetadataRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to save SEO metadata.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to save SEO metadata.",
      },
      { status: 500 },
    );
  }
}
