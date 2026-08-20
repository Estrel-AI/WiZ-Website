import { NextRequest, NextResponse } from "next/server";
import { HUB_BASE_URL, PAYMENTS_API_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";
import { getTokenFromRequest, verifyAuthToken } from "@/src/lib/website-auth";

export const runtime = "nodejs";

type CheckoutRequest = {
  planCode?: string | null;
  addonCode?: string | null;
};

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated." },
      { status: 401 },
    );
  }

  const user = verifyAuthToken(token);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated." },
      { status: 401 },
    );
  }

  const body = ((await request.json().catch(() => ({}))) ?? {}) as CheckoutRequest;
  const planCode = body.planCode?.trim() || "";
  const addonCode = body.addonCode?.trim() || "";
  const selectedCode = planCode || addonCode;

  if (!selectedCode) {
    return NextResponse.json(
      { success: false, message: "Plan code or addon code is required." },
      { status: 400 },
    );
  }

  const zohoCustomerId = user.zoho_customer_id?.trim() || "";

  if (!zohoCustomerId || zohoCustomerId === "pending_api_sync") {
    return NextResponse.json(
      { success: false, message: "User is not registered in Zoho. Please contact support." },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    zoho_customer_id: zohoCustomerId,
    customer_name: user.name?.trim() || user.username || user.email,
    customer_email: user.email,
    plan_code: selectedCode,
    redirect_url: buildPublicApiUrl(HUB_BASE_URL, "/aistudio/login"),
  });

  return NextResponse.json({
    success: true,
    checkout_url: `${buildPublicApiUrl(PAYMENTS_API_BASE_URL, "/payments/checkOut")}?${params.toString()}`,
  });
}
