import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsApi, CreateGoalDto, UpdateGoalDto } from "../api";

export const useGoals = () => {
  return useQuery({
    queryKey: ["goals"],
    queryFn: goalsApi.getAll,
  });
};

export const useGoal = (id: number) => {
  return useQuery({
    queryKey: ["goals", id],
    queryFn: () => goalsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalDto) => goalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGoalDto }) =>
      goalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => goalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
};
