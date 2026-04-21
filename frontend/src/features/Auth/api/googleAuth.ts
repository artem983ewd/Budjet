import { apiClient } from "@/shared/lib/api";

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token: string;
}

export async function googleAuthApi(googleToken: string): Promise<GoogleTokenResponse> {
  return apiClient<GoogleTokenResponse>("/auth/google/token", {
    method: "POST",
    body: { googleToken },
  });
}
