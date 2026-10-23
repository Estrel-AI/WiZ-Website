import { buildPublicApiUrl, AUTH_API_BASE_URL } from "@/src/config/public-env";
import type {
  AuthApiPayload,
  GenerateOtpRequest,
  VerifyOtpRequest,
  PasswordResetRequest,
  SigninRequest,
  SignupRequest,
  UserRegisteredResponse,
} from "@/src/types/auth";

async function parseJsonResponse<T extends AuthApiPayload>(response: Response): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

function toStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function extractApiErrorMessage(responseData: AuthApiPayload | null): string | null {
  if (!responseData) {
    return null;
  }

  const { message, errors, detail } = responseData;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  const errorList = toStringList(errors);
  if (errorList.length > 0) {
    return errorList.join(" ");
  }

  const strength = responseData.strength as { suggestions?: unknown } | undefined;
  const suggestions = toStringList(strength?.suggestions);
  if (suggestions.length > 0) {
    return suggestions.join(" ");
  }

  const detailList = toStringList(detail);
  if (detailList.length > 0) {
    return detailList.join(" ");
  }

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  return null;
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
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const responseData = await parseJsonResponse<T>(response);

  if (!response.ok) {
    throw new Error(extractApiErrorMessage(responseData) || "The request could not be completed.");
  }

  return (responseData ?? {}) as T;
}

export function requestSignupOtp(payload: GenerateOtpRequest) {
  return postAuthEndpoint("generate_otp", payload);
}

export function verifyOtp(payload: VerifyOtpRequest) {
  return postAuthEndpoint("is_valid_otp", payload);
}

export { generateBusinessOtp, verifyBusinessOtp, submitBusinessSignup, submitBusinessSignin } from "./auth.service";

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
