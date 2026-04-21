import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, CreateCategoryDto, UpdateCategoryDto } from "../api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryDto }) =>
      categoriesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};