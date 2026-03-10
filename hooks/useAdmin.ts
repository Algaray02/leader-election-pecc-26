import { useQuery } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";

export const adminQueryKeys = {
  stats: ["admin", "stats"],
  liveVotes: ["admin", "liveVotes"],
};

export const useAdmin = (liveVotesParams?: any) => {
  const statsQuery = useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: async () => {
      const { data } = await AdminAPI.getStats();
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  const liveVotesQuery = useQuery({
    queryKey: [...adminQueryKeys.liveVotes, liveVotesParams],
    queryFn: async () => {
      const response: any = await AdminAPI.getLiveVotes(liveVotesParams);
      // Ensure we return both data and meta for pagination
      return {
        data: response.data,
        meta: response.meta
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    stats: statsQuery.data,
    liveVotes: liveVotesQuery.data?.data || [],
    liveVotesMeta: liveVotesQuery.data?.meta,
    isLoading: statsQuery.isLoading || liveVotesQuery.isLoading,
    isError: statsQuery.isError || liveVotesQuery.isError,
    error: statsQuery.error || liveVotesQuery.error,
    refetch: () => {
      statsQuery.refetch();
      liveVotesQuery.refetch();
    },
  };
};
