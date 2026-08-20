import { NextResponse } from "next/server";
import { getAdminSession } from "@/src/lib/admin-auth";
import {
  buildDashboardStats,
  readAdminCmsData,
  writeAdminCmsData,
} from "@/src/lib/admin-cms";
import type { AdminCmsData } from "@/src/types/admin-cms";

async function assertAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const data = await readAdminCmsData();
  return NextResponse.json({
    data,
    stats: buildDashboardStats(data),
  });
}

export async function PUT(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await request.json()) as { data?: AdminCmsData };

  if (!body.data) {
    return NextResponse.json({ message: "Missing CMS payload." }, { status: 400 });
  }

  const data = await writeAdminCmsData(body.data);

  return NextResponse.json({
    ok: true,
    data,
    stats: buildDashboardStats(data),
  });
}
