
// Types
export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  imageUrl: string;
  voteCount?: number;
}

export interface Vote {
  id: string;
  voterId: string;
  candidateId: string;
  timestamp: string;
}

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jane Smith',
    party: 'Progressive Party',
    position: 'President',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    voteCount: 145
  },
  {
    id: '2',
    name: 'John Doe',
    party: 'Conservative Party',
    position: 'President',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    voteCount: 120
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    party: 'Liberty Party',
    position: 'President',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    voteCount: 95
  },
  {
    id: '4',
    name: 'Robert Johnson',
    party: 'Unity Party',
    position: 'President',
    imageUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    voteCount: 88
  }
];

// Mock API methods
export const api = {
  // Auth endpoints would connect to real backend
  
  // Get all candidates
  getCandidates: async (): Promise<Candidate[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockCandidates];
  },
  
  // Cast a vote
  castVote: async (voterId: string, candidateId: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if user has already voted (would be handled by backend)
    const existingVote = localStorage.getItem(`vote_${voterId}`);
    if (existingVote) {
      throw new Error('You have already cast your vote');
    }
    
    // Record the vote
    localStorage.setItem(`vote_${voterId}`, candidateId);
    
    return { success: true };
  },
  
  // Get election results
  getResults: async (): Promise<Candidate[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would come from the backend
    return [...mockCandidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  },
  
  // Check if user has voted
  hasVoted: (userId: string): boolean => {
    return !!localStorage.getItem(`vote_${userId}`);
  },
  
  // Get user's vote
  getUserVote: async (userId: string): Promise<string | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return localStorage.getItem(`vote_${userId}`);
  }
};
