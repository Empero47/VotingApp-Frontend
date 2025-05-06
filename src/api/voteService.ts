import apiClient from './apiClient';
import { Candidate, Vote } from './types';

const voteService = {
  castVote: async (candidateId: number): Promise<Vote> => {
    const response = await apiClient.post<Vote>('/votes', { candidateId });
    return response.data;
  },

  getResults: async (): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>('/votes/results');
    return response.data;
  },
  
  hasVoted: async (): Promise<boolean> => {
    const response = await apiClient.get<boolean>('/votes/check');
    return response.data;
  },
  
  getUserVote: async (): Promise<number | null> => {
    const response = await apiClient.get<number | null>('/votes/user');
    return response.data;
  }
};

export default voteService;
