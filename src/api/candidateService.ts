
import apiClient from './apiClient';
import { Candidate } from './mockApi';

const candidateService = {
  getCandidates: async (): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>('/candidates');
    return response.data;
  },
  
  // Admin-only endpoints
  addCandidate: async (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
    const response = await apiClient.post<Candidate>('/admin/candidates', candidate);
    return response.data;
  },
  
  updateCandidate: async (id: string, candidate: Partial<Candidate>): Promise<Candidate> => {
    const response = await apiClient.put<Candidate>(`/admin/candidates/${id}`, candidate);
    return response.data;
  },
  
  deleteCandidate: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/candidates/${id}`);
  }
};

export default candidateService;
