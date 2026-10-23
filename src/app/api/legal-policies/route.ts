import { NextResponse } from "next/server";
import { getAllLegalPoliciesAdmin } from "@/src/lib/admin-legal-policies";
import type { ApiResponse, LegalPolicyRow } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getAllLegalPoliciesAdmin();
    return NextResponse.json<ApiResponse<LegalPolicyRow[]>>({
      success: true,
      message: "Active legal policies retrieved.",
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<LegalPolicyRow[]>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load legal policies.",
        data: [],
        error: error instanceof Error ? error.message : "Failed to load legal policies.",
      },
      { status: 500 },
    );
  }
}
