import { apiClient } from "@/shared/lib/api";
import { LoginResponse } from "./login";

export type { LoginResponse };

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function registerApi(credentials: RegisterCredentials): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/register", {
    method: "POST",
    body: credentials,
  });
}
