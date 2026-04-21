import { apiClient } from "@/shared/lib/api";
import { Debt, CreateDebtDto, UpdateDebtDto } from "@/entities/Debt";

export type { CreateDebtDto, UpdateDebtDto };

export const debtsApi = {
  getAll: () => apiClient<Debt[]>("/debts", { method: "GET" }),
  getById: (id: number) => apiClient<Debt>(`/debts/${id}`, { method: "GET" }),
  create: (data: CreateDebtDto) => apiClient<Debt>("/debts", { method: "POST", body: data }),
  update: (id: number, data: UpdateDebtDto) => apiClient<Debt>(`/debts/${id}`, { method: "PATCH", body: data }),
  delete: (id: number) => apiClient<void>(`/debts/${id}`, { method: "DELETE" }),
};
