import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi, CreateTransactionDto, UpdateTransactionDto } from "../api";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsApi.getAll,
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionDto }) =>
      transactionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", id] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};