
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  profileComplete: boolean;
}

export interface JobPosting {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string;
  contact_person?: string;
  url?: string;
  created_at: string;
  updated_at?: string;
  deadline?: string;
}

export interface CoverLetter {
  id: string;
  user_id: string;
  job_posting_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  education: string;
  skills: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock data for development/testing purposes
export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    phone: "+45 12 34 56 78",
    address: "Nørrebrogade 42, 2200 København N",
    profileComplete: true
  }
];

export const mockJobPostings: JobPosting[] = [
  {
    id: "1",
    user_id: "1",
    title: "UX Designer",
    company: "Designbureau A/S",
    description: "Vi søger en dygtig UX designer med erfaring fra digitale projekter. Du vil indgå i vores kreative team og arbejde med spændende kunder i forskellige brancher.",
    contact_person: "Maria Hansen",
    url: "https://example.com/job/ux-designer",
    created_at: new Date().toISOString(),
    deadline: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString()
  },
  {
    id: "2",
    user_id: "1",
    title: "Frontend Developer",
    company: "TechStart ApS",
    description: "Er du passioneret omkring moderne frontend-teknologier? Vi søger en udvikler der kan hjælpe os med at bygge intuitive brugergrænseflader til vores produkter.",
    contact_person: "Lars Jensen",
    url: "https://example.com/job/frontend-developer",
    created_at: new Date().toISOString(),
    deadline: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString()
  }
];

export const mockCoverLetters: CoverLetter[] = [
  {
    id: "1",
    user_id: "1",
    job_posting_id: "1",
    content: "Kære Maria Hansen,\n\nJeg skriver til dig angående stillingen som UX Designer hos Designbureau A/S. Med min baggrund i brugeroplevelse og digitalt design, er jeg overbevist om, at jeg kan bidrage til jeres kreative team.\n\nMed venlig hilsen,\nDemo User\nTlf: +45 12 34 56 78\nEmail: demo@example.com",
    created_at: new Date().toISOString()
  }
];
