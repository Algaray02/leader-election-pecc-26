import api from "./axios";

export const VoterAPI = {
  // Candidate Endpoints
  getCandidates: () => api.get("/candidates"),
  getCandidateById: (id: string) => api.get(`/candidates/${id}`),

  // Voting Endpoints
  submitVote: (candidateId: string) => api.post("/vote", { candidateId }),
};
