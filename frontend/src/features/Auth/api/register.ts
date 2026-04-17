import { apiClient } from "@/shared/lib/api";
import { LoginCredentials, LoginResponse } from "./login";

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export async function registerApi(credentials: RegisterCredentials): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/register", {
    method: "POST",
    body: credentials,
  });
}
