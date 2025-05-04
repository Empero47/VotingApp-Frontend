
import apiClient from './apiClient';
import { Candidate } from './mockApi';

export interface CastVoteRequest {
  voterId: string;
  candidateId: string;
}

const voteService = {
  castVote: async (voterId: string, candidateId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post('/votes', { voterId, candidateId });
    return response.data;
  },

  getResults: async (): Promise<Candidate[]> => {
    const response = await apiClient.get<Candidate[]>('/votes/results');
    return response.data;
  },
  
  hasVoted: async (userId: string): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/votes/check?voterId=${userId}`);
    return response.data;
  },
  
  getUserVote: async (userId: string): Promise<string | null> => {
    const response = await apiClient.get<string | null>(`/votes/user?voterId=${userId}`);
    return response.data;
  }
};

export default voteService;
