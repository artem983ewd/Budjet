import { apiClient } from "@/shared/lib/api";

export interface TransactionApi {
  id: number;
  amount: number;
  description?: string;
  transactionDate: string;
  category: {
    id: number;
    name: string;
    type: "income" | "expense";
    icon?: string;
  };
  account?: {
    id: number;
    name: string;
  };
  goalId?: number;
  debtId?: number;
}

export interface CreateTransactionDto {
  categoryId: number;
  amount: number;
  description?: string;
  transactionDate: Date;
  accountId?: number;
  goalId?: number;
  debtId?: number;
}

export interface UpdateTransactionDto {
  categoryId?: number;
  amount?: number;
  description?: string;
  transactionDate?: Date;
  accountId?: number;
  goalId?: number;
  debtId?: number;
}

export const transactionsApi = {
  getAll: () => apiClient<TransactionApi[]>("/transactions", { method: "GET" }),

  getByDateRange: (startDate: string, endDate: string) =>
    apiClient<TransactionApi[]>(
      `/transactions?startDate=${startDate}&endDate=${endDate}`,
      { method: "GET" },
    ),

  getById: (id: number) =>
    apiClient<TransactionApi>(`/transactions/${id}`, { method: "GET" }),

  create: (data: CreateTransactionDto) =>
    apiClient<TransactionApi>("/transactions", { method: "POST", body: data }),

  update: (id: number, data: UpdateTransactionDto) =>
    apiClient<TransactionApi>(`/transactions/${id}`, {
      method: "PATCH",
      body: data,
    }),

  delete: (id: number) =>
    apiClient<void>(`/transactions/${id}`, { method: "DELETE" }),
};