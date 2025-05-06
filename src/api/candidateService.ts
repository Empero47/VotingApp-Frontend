import apiClient from './apiClient';
import { Candidate } from './types';

const candidateService = {
  getCandidates: async (): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>('/candidates');
    return response.data;
  },
  
  getCandidate: async (id: number): Promise<Candidate> => {
    const response = await apiClient.get<Candidate>(`/candidates/${id}`);
    return response.data;
  },
  
  // Admin endpoints
  addCandidate: async (data: Omit<Candidate, 'id' | 'voteCount' | 'createdAt' | 'updatedAt'>): Promise<Candidate> => {
    const response = await apiClient.post<Candidate>('/admin/candidates', data);
    return response.data;
  },
  
  updateCandidate: async (id: number, data: Partial<Omit<Candidate, 'id' | 'voteCount'>>): Promise<Candidate> => {
    const response = await apiClient.put<Candidate>(`/admin/candidates/${id}`, data);
    return response.data;
  },
  
  deleteCandidate: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/candidates/${id}`);
  }
};

export default candidateService;
