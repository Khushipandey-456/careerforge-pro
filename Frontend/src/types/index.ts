export type Plan = "guest" | "free" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Resume {
  id: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  templateId: string;
  atsScore: number;
  lastModified: string;
}

export interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  plan: Plan;
  resumes: Resume[];
  currentResume: Resume | null;
  loading: boolean;
  loginModalOpen: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setPlan: (plan: Plan) => void;
  setResumes: (resumes: Resume[]) => void;
  setCurrentResume: (resume: Resume | null) => void;
  updateCurrentResume: (updates: Partial<Resume>) => void;
  setLoading: (loading: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSidebarOpen: (open: boolean) => void;
}
