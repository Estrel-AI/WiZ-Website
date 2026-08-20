import { ADMIN_AUTH_TOKEN_KEY } from "@/src/lib/admin-auth-storage";

export function setAdminAuthToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
}

export function clearAdminAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
}
