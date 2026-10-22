import { AUTH_USER_KEY, HUB_LOGIN_URL } from "./website-auth";

export function getHubLoginUrl(): string {
  return HUB_LOGIN_URL;
}

export function getLoginUrlFromUser(_userData?: Record<string, unknown> | null): string {
  return HUB_LOGIN_URL;
}
