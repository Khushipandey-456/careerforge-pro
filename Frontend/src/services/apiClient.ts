export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * A central client to simulate making HTTP requests to the backend.
 * In a real backend scenario, this would use fetch or axios and
 * automatically append the Authorization bearer token to headers.
 */
export const apiClient = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Real backend call logic (Currently simulated success for demo purposes pending live backend)
  // const response = await fetch(`${API_BASE_URL}${path}`, {
  //   ...options,
  //   headers,
  // });
  // if (!response.ok) {
  //   throw new Error(`API error: ${response.status}`);
  // }
  // return response.json();
  
  // Simulated network delay wrapper for UI continuity
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 800);
  });
};
