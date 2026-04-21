import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { debtsApi, CreateDebtDto, UpdateDebtDto } from "../api";

export const useDebts = () => {
  return useQuery({
    queryKey: ["debts"],
    queryFn: debtsApi.getAll,
  });
};

export const useDebt = (id: number) => {
  return useQuery({
    queryKey: ["debts", id],
    queryFn: () => debtsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDebtDto) => debtsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
};

export const useUpdateDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDebtDto }) =>
      debtsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
};

export const useDeleteDebt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => debtsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
};
