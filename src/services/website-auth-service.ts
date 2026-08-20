import { buildPublicApiUrl, AUTH_API_BASE_URL } from "@/src/config/public-env";
import type {
  AuthApiPayload,
  GenerateOtpRequest,
  PasswordResetRequest,
  SigninRequest,
  SignupRequest,
  UserRegisteredResponse,
} from "@/src/types/auth";

async function parseJsonResponse<T extends AuthApiPayload>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

async function postAuthEndpoint<T extends AuthApiPayload>(
  path: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(buildPublicApiUrl(AUTH_API_BASE_URL, path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await parseJsonResponse<T>(response);

  if (!response.ok) {
    throw new Error(responseData?.message || "The request could not be completed.");
  }

  return (responseData ?? {}) as T;
}

export function requestSignupOtp(payload: GenerateOtpRequest) {
  return postAuthEndpoint("generate_otp", payload);
}

export function submitSignup(payload: SignupRequest) {
  return postAuthEndpoint("signup", payload);
}

export function submitSignin(payload: SigninRequest) {
  return postAuthEndpoint("signin", payload);
}

export function requestPasswordReset(payload: PasswordResetRequest) {
  return postAuthEndpoint("password-reset/request", payload);
}

export async function checkUserRegistered(email: string) {
  const query = new URLSearchParams({ email }).toString();
  const response = await fetch(buildPublicApiUrl(AUTH_API_BASE_URL, `/user_registered?${query}`), {
    method: "GET",
  });

  const responseData = await parseJsonResponse<UserRegisteredResponse>(response);

  if (!response.ok) {
    throw new Error(responseData?.message || "Unable to verify whether this email is already registered.");
  }

  if (responseData?.status === "conflict" || responseData?.data?.status === "conflict") {
    return true;
  }

  return Boolean(
    responseData?.registered ??
      responseData?.exists ??
      responseData?.data?.registered ??
      responseData?.data?.exists,
  );
}
