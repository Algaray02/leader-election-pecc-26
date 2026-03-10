import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";
import { adminQueryKeys } from "./useAdmin";

export const adminCandidateKeys = {
  all: ["admin", "candidates"],
  lists: () => [...adminCandidateKeys.all, "list"],
  details: () => [...adminCandidateKeys.all, "detail"],
  detail: (id: string) => [...adminCandidateKeys.details(), id],
};

const invalidateCandidateQueries = (queryClient: any, candidateId: string | null = null) => {
  queryClient.invalidateQueries({ queryKey: adminCandidateKeys.lists() });
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats }); // Invalidate dashboard since candidate logic might change stats
  if (candidateId) {
    queryClient.invalidateQueries({ queryKey: adminCandidateKeys.detail(candidateId) });
  }
};

export const useCandidates = () => {
  return useQuery({
    queryKey: adminCandidateKeys.lists(),
    queryFn: async () => {
      const response = await AdminAPI.getCandidates();
      return response.data;
    },
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: adminCandidateKeys.detail(id),
    queryFn: async () => {
      const response = await AdminAPI.getCandidate(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => AdminAPI.createCandidate(data),
    onSuccess: () => invalidateCandidateQueries(queryClient),
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AdminAPI.updateCandidate(id, data),
    onSuccess: (_, { id }) => invalidateCandidateQueries(queryClient, id),
  });
};

export const useDeleteCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminAPI.deleteCandidate(id),
    onSuccess: () => invalidateCandidateQueries(queryClient),
  });
};
