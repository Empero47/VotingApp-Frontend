export interface Candidate {
  id: number;
  name: string;
  party: string;
  position: string;
  imageUrl: string;
  voteCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Vote {
  id: number;
  userId: number;
  candidateId: number;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}