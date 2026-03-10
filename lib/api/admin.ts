import api from "./axios";

export const AdminAPI = {
  // Statistics & Dashboard
  getStats: () => api.get("/admin/dashboard/stats"),
  getLiveVotes: (params?: any) => api.get("/admin/dashboard/live", { params }),

  // Participants
  getParticipants: (params?: any) => api.get("/admin/participants", { params }),
  createParticipant: (data: any) => api.post("/admin/participants", data),
  updateParticipant: (id: string, data: any) => api.patch(`/admin/participants/${id}`, data),
  deleteParticipant: (id: string) => api.delete(`/admin/participants/${id}`),

  // Candidates
  getCandidates: () => api.get("/admin/candidates"),
  getCandidate: (id: string) => api.get(`/admin/candidates/${id}`),
  createCandidate: (data: any) => api.post("/admin/candidates", data),
  updateCandidate: (id: string, data: any) => api.patch(`/admin/candidates/${id}`, data),
  deleteCandidate: (id: string) => api.delete(`/admin/candidates/${id}`),

  // Bulk Operations
  uploadParticipants: (data: any[]) => api.post("/admin/participants/bulk", data),
};
