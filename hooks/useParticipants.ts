import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";
import { adminQueryKeys } from "./useAdmin";

export const adminParticipantKeys = {
  all: ["admin", "participants"],
  lists: () => [...adminParticipantKeys.all, "list"],
  list: (filters: any) => [...adminParticipantKeys.lists(), filters],
};

const invalidateParticipantQueries = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: adminParticipantKeys.lists() });
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats }); 
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.liveVotes }); 
};

export const useParticipants = (filters: any) => {
  return useQuery({
    queryKey: adminParticipantKeys.list(filters),
    queryFn: async () => {
      const response: any = await AdminAPI.getParticipants(filters);
      return {
        data: response.data,
        meta: response.meta
      };
    },
  });
};

export const useCreateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => AdminAPI.createParticipant(data),
    onSuccess: () => invalidateParticipantQueries(queryClient),
  });
};

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => AdminAPI.updateParticipant(id, data),
    onSuccess: () => invalidateParticipantQueries(queryClient),
  });
};

export const useDeleteParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminAPI.deleteParticipant(id),
    onSuccess: () => invalidateParticipantQueries(queryClient),
  });
};

export const useSendParticipantEmail = () => {
  return useMutation({
    mutationFn: (id: string) => AdminAPI.sendEmail(id),
  });
};

export const useSendEmailsToAll = () => {
  return useMutation({
    mutationFn: () => AdminAPI.sendEmailsToAll(),
  });
};

