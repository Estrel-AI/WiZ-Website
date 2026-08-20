import { apiGet } from "./api-client";
import type { User } from "../types/user.types";

export async function fetchUsers() {
  return apiGet<User[]>("/api/users");
}
