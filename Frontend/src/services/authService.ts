import { apiClient } from './apiClient';
import { User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
  plan: 'free' | 'pro' | 'guest';
}

export const authService = {
  async signup(email: string, password?: string): Promise<AuthResponse> {
    // Expected endpoint: POST /api/users/signup
    await apiClient('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Mock response shape expected from real backend
    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
      },
      token: 'mock-jwt-token-abc-123',
      plan: 'free',
    };
  },

  async login(email: string, password?: string): Promise<AuthResponse> {
    // Expected endpoint: POST /api/users/login
    await apiClient('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
      },
      token: 'mock-jwt-token-xyz-789',
      plan: 'free',
    };
  },

  logout(): void {
    localStorage.removeItem('token');
  },
};
