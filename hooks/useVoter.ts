import { useQuery, useMutation } from "@tanstack/react-query";
import { VoterAPI } from "@/lib/api/voter";

export const voterKeys = {
  candidates: ["voter", "candidates"] as const,
  candidate: (id: string) => ["voter", "candidate", id] as const,
};

// Hook for fetching all candidates
export function useVoterCandidates() {
  return useQuery({
    queryKey: voterKeys.candidates,
    queryFn: async () => {
      const response = await VoterAPI.getCandidates();
      return response.data;
    },
  });
}

// Hook for fetching a single candidate
export function useVoterCandidate(id: string) {
  return useQuery({
    queryKey: voterKeys.candidate(id),
    queryFn: async () => {
      const response = await VoterAPI.getCandidateById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Hook for submitting a vote
export function useSubmitVote() {
  return useMutation({
    mutationFn: (candidateId: string) => VoterAPI.submitVote(candidateId),
  });
}
