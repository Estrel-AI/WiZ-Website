import { NextRequest } from "next/server";
import { getWebsiteAboutTeamMembers } from "@/src/lib/website-about-team";
import type { AboutTeamCategory, AboutTeamMemberRow, ApiResponse } from "@/src/types/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const category: AboutTeamCategory = categoryParam === "PRODUCT" ? "PRODUCT" : "LEADERSHIP";

    const data = await getWebsiteAboutTeamMembers(category);
    return Response.json({
      success: true,
      data,
      message: `Active ${category} team members fetched.`,
      error: null,
    } satisfies ApiResponse<AboutTeamMemberRow[]>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch team members.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
