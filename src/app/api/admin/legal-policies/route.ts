import { NextResponse } from "next/server";
import {
  getAllLegalPoliciesAdmin,
  upsertLegalPolicy,
} from "@/src/lib/admin-legal-policies";
import type { ApiResponse, LegalPolicyRow, LegalPolicyUpsertPayload } from "@/src/types/admin-api";

export async function GET() {
  try {
    const data = await getAllLegalPoliciesAdmin();
    return NextResponse.json<ApiResponse<LegalPolicyRow[]>>({
      success: true,
      message: "Legal policies retrieved successfully.",
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LegalPolicyUpsertPayload;

    if (!body.policyKey || !body.policyKey.trim()) {
      return NextResponse.json<ApiResponse<LegalPolicyRow | null>>(
        { success: false, message: "Policy key is required.", data: null, error: "Policy key is required." },
        { status: 400 },
      );
    }

    if (!body.title || !body.title.trim()) {
      return NextResponse.json<ApiResponse<LegalPolicyRow | null>>(
        { success: false, message: "Title is required.", data: null, error: "Title is required." },
        { status: 400 },
      );
    }

    if (!body.content || !body.content.trim()) {
      return NextResponse.json<ApiResponse<LegalPolicyRow | null>>(
        { success: false, message: "Policy content cannot be empty.", data: null, error: "Policy content cannot be empty." },
        { status: 400 },
      );
    }

    const data = await upsertLegalPolicy(body);
    return NextResponse.json<ApiResponse<LegalPolicyRow>>({
      success: true,
      message: `${data.title} updated successfully.`,
      data,
      error: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<LegalPolicyRow | null>>(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to save legal policy.",
        data: null,
        error: error instanceof Error ? error.message : "Failed to save legal policy.",
      },
      { status: 500 },
    );
  }
}
