import { apiClient } from "@/shared/lib/api";
import { Account, CreateAccountDto, UpdateAccountDto } from "@/entities/Account";

export const accountsApi = {
  getAll: () => apiClient<Account[]>("/accounts", { method: "GET" }),
  getById: (id: number) => apiClient<Account>(`/accounts/${id}`, { method: "GET" }),
  create: (data: CreateAccountDto) => apiClient<Account>("/accounts", { method: "POST", body: data }),
  update: (id: number, data: UpdateAccountDto) => apiClient<Account>(`/accounts/${id}`, { method: "PATCH", body: data }),
  delete: (id: number) => apiClient<void>(`/accounts/${id}`, { method: "DELETE" }),
};
