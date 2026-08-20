import { apiGet } from "./api-client";
import type { AuthSession } from "../types/auth.types";

export async function fetchSession() {
  return apiGet<AuthSession>("/api/auth/session");
}
