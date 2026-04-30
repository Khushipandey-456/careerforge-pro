import { create } from 'zustand';
import { AppState } from '../types';

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
};

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialToken = getInitialToken();

export const useStore = create<AppState>((set) => ({
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  plan: 'guest',
  resumes: [],
  currentResume: null,
  loading: false,
  loginModalOpen: false,
  theme: getInitialTheme(),
  sidebarOpen: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },
  setPlan: (plan) => set({ plan }),
  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  updateCurrentResume: (updates) =>
    set((state) => ({
      currentResume: state.currentResume ? { ...state.currentResume, ...updates } : null,
    })),
  setLoading: (loading) => set({ loading }),
  setLoginModalOpen: (open) => set({ loginModalOpen: open }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
