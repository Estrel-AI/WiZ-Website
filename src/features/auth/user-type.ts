import { AUTH_USER_KEY, DEVELOPER_LOGIN_URL, BUSINESS_LOGIN_URL } from "./website-auth";

export function getHubLoginUrl(): string {
  if (typeof window === "undefined") {
    return DEVELOPER_LOGIN_URL;
  }

  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return DEVELOPER_LOGIN_URL;
  }

  try {
    const userData = JSON.parse(raw) as Record<string, unknown>;
    if (userData.org_id) {
      return BUSINESS_LOGIN_URL;
    }
    return DEVELOPER_LOGIN_URL;
  } catch {
    return DEVELOPER_LOGIN_URL;
  }
}

export function getLoginUrlFromUser(userData: Record<string, unknown> | null): string {
  if (!userData?.org_id) {
    return DEVELOPER_LOGIN_URL;
  }
  return BUSINESS_LOGIN_URL;
}
