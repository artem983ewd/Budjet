import { apiClient } from "@/shared/lib/api";
import { IconName } from "@/shared/ui/IconRenderer";

export interface CategoryApi {
  id: number;
  name: string;
  type: "income" | "expense";
  icon: string;
  parent: CategoryApi | null;
  children: CategoryApi[];
}

export interface CreateCategoryDto {
  name: string;
  type: "income" | "expense";
  icon?: IconName;
  parentId?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  type?: "income" | "expense";
  icon?: IconName;
  parentId?: number;
}

export const categoriesApi = {
  getAll: () => apiClient<CategoryApi[]>("/categories", { method: "GET" }),

  getById: (id: number) =>
    apiClient<CategoryApi>(`/categories/${id}`, { method: "GET" }),

  create: (data: CreateCategoryDto) =>
    apiClient<CategoryApi>("/categories", { method: "POST", body: data }),

  update: (id: number, data: UpdateCategoryDto) =>
    apiClient<CategoryApi>(`/categories/${id}`, { method: "PATCH", body: data }),

  delete: (id: number) =>
    apiClient<void>(`/categories/${id}`, { method: "DELETE" }),
};