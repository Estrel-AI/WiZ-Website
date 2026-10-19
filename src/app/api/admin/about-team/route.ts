import { NextRequest } from "next/server";
import { listAboutTeamMembers, upsertAboutTeamMember } from "@/src/lib/admin-about-team";
import type {
  AboutTeamCategory,
  AboutTeamMemberRow,
  AboutTeamMemberUpsertPayload,
  ApiResponse,
} from "@/src/types/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categoryParam = searchParams.get("category");
    const category = categoryParam === "LEADERSHIP" || categoryParam === "PRODUCT" ? (categoryParam as AboutTeamCategory) : undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam === null ? undefined : isActiveParam === "true";

    const data = await listAboutTeamMembers({ category, search, isActive });
    return Response.json({
      success: true,
      data,
      message: "Team members fetched successfully.",
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AboutTeamMemberUpsertPayload;
    if (!body.name?.trim()) {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Name is required.",
          error: "Name is required.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    if (body.category !== "LEADERSHIP" && body.category !== "PRODUCT") {
      return Response.json(
        {
          success: false,
          data: null,
          message: "Category must be LEADERSHIP or PRODUCT.",
          error: "Invalid category.",
        } satisfies ApiResponse<null>,
        { status: 400 },
      );
    }

    const item = await upsertAboutTeamMember(body);
    return Response.json({
      success: true,
      data: item,
      message: body.id ? "Team member updated successfully." : "Team member created successfully.",
      error: null,
    } satisfies ApiResponse<AboutTeamMemberRow>);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: "Failed to save team member.",
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiResponse<null>,
      { status: 500 },
    );
  }
}
