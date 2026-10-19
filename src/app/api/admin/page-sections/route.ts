import { NextRequest } from "next/server";
import { listPageSections } from "@/src/lib/admin-page-sections";
import type { ApiResponse, PageSectionRow } from "@/src/types/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get("pageKey")?.trim() || "";

    if (!pageKey) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "pageKey query parameter is required.",
          error: "pageKey query parameter is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const data = await listPageSections(pageKey);
    return Response.json({
      success: true,
      data,
      message: "Page sections fetched successfully.",
      error: null,
    } satisfies ApiResponse<PageSectionRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch page sections.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}