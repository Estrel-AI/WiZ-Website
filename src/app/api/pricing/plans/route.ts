import { NextResponse } from "next/server";
import { PAYMENTS_API_BASE_URL, buildPublicApiUrl } from "@/src/config/public-env";

export const runtime = "nodejs";

export async function POST() {
  try {
    const url = buildPublicApiUrl(PAYMENTS_API_BASE_URL, "/plans/getSubscriptionPlans");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_code: "" }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { code: -1, plans: [], addons_packs: [], message: error instanceof Error ? error.message : "Unable to fetch pricing plans." },
      { status: 502 },
    );
  }
}
