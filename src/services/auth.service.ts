import { apiGet } from "./api-client";
import type { AuthApiResponse, AuthSession, BusinessSignupPayload, GenerateOtpRequest, VerifyOtpRequest } from "../types/auth.types";

export async function fetchSession() {
  return apiGet<AuthSession>("/api/auth/session");
}

const BUSINESS_AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_BUSINESS_AUTH_API_BASE_URL ||
  "https://testwbs.wiiz.it/aiwf";


export async function generateBusinessOtp(payload: GenerateOtpRequest): Promise<AuthApiResponse> {
  const response = await fetch(`${BUSINESS_AUTH_BASE_URL}/generate_otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as AuthApiResponse | null;

  if (!response.ok) {
    throw new Error(data?.message || "Failed to generate OTP. Please try again.");
  }

  return data ?? {};
}

export async function verifyBusinessOtp(payload: VerifyOtpRequest): Promise<AuthApiResponse> {
  const response = await fetch(`${BUSINESS_AUTH_BASE_URL}/is_valid_otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as AuthApiResponse | null;

  if (!response.ok) {
    throw new Error(data?.message || "Invalid OTP. Please try again.");
  }

  return data ?? {};
}

export async function submitBusinessSignup(payload: BusinessSignupPayload): Promise<AuthApiResponse> {
  const response = await fetch(`${BUSINESS_AUTH_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as AuthApiResponse | null;

  if (!response.ok) {
    throw new Error(data?.message || "Business signup failed. Please try again.");
  }

  return data ?? {};
}

