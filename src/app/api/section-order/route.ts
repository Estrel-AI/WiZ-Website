import { NextRequest } from "next/server";
import { getWebsitePageSectionKeys } from "@/src/lib/website-page-sections";
import type { ApiResponse } from "@/src/types/admin-api";

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

    const data = await getWebsitePageSectionKeys(pageKey);
    return Response.json({
      success: true,
      data,
      message: "Active page section order fetched.",
      error: null,
    } satisfies ApiResponse<string[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch page section order.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}