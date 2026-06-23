import { apiClient } from "@/shared/lib/api";
import { Goal, CreateGoalDto, UpdateGoalDto } from "@/entities/Goal";

export const goalsApi = {
  getAll: () => apiClient<Goal[]>("/goals", { method: "GET" }),
  getById: (id: number) => apiClient<Goal>(`/goals/${id}`, { method: "GET" }),
  create: (data: CreateGoalDto) => apiClient<Goal>("/goals", { method: "POST", body: data }),
  update: (id: number, data: UpdateGoalDto) => apiClient<Goal>(`/goals/${id}`, { method: "PATCH", body: data }),
  delete: (id: number) => apiClient<void>(`/goals/${id}`, { method: "DELETE" }),
};
