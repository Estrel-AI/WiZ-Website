import { NextResponse } from "next/server";
import { getAdminSession } from "@/src/lib/admin-auth";
import type { ApiResponse } from "@/src/types/admin-api";

export async function assertAdmin() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Unauthorized", data: null, error: "Unauthorized" },
      { status: 401 },
    );
  }

  return null;
}

export function ok<T>(message: string, data: T) {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    message,
    data,
    error: null,
  });
}

export function badRequest(message: string) {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, message, data: null, error: message },
    { status: 400 },
  );
}

export function notFound(message: string) {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, message, data: null, error: message },
    { status: 404 },
  );
}

export function serverError(message: string) {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, message, data: null, error: message },
    { status: 500 },
  );
}
