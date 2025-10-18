import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generationsApi } from '../services/api';
import type { CreateGenerationRequest } from '../services/api';

// Query key factory
export const generationKeys = {
  all: ['generations'] as const,
  list: (limit: number) => [...generationKeys.all, 'list', limit] as const,
};

// Hook to fetch generations list
export const useGenerations = (limit: number = 5) => {
  return useQuery({
    queryKey: generationKeys.list(limit),
    queryFn: () => generationsApi.list(limit),
  });
};

// Hook to create a new generation
export const useCreateGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, signal }: { data: CreateGenerationRequest; signal?: AbortSignal }) =>
      generationsApi.create(data, signal),
    onSuccess: () => {
      // Invalidate and refetch generations list
      queryClient.invalidateQueries({ queryKey: generationKeys.all });
    },
  });
};
