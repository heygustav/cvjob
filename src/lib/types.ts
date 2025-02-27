
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
  userId: string;
  title: string;
  company: string;
  description: string;
  contactPerson?: string;
  url?: string;
  createdAt: Date;
}

export interface CoverLetter {
  id: string;
  userId: string;
  jobPostingId: string;
  content: string;
  createdAt: Date;
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

// Simulating authentication in a frontend-only app for demo purposes
// In a real app, we would use proper authentication with a backend
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
    userId: "1",
    title: "UX Designer",
    company: "Designbureau A/S",
    description: "Vi søger en dygtig UX designer med erfaring fra digitale projekter. Du vil indgå i vores kreative team og arbejde med spændende kunder i forskellige brancher.",
    contactPerson: "Maria Hansen",
    url: "https://example.com/job/ux-designer",
    createdAt: new Date()
  },
  {
    id: "2",
    userId: "1",
    title: "Frontend Developer",
    company: "TechStart ApS",
    description: "Er du passioneret omkring moderne frontend-teknologier? Vi søger en udvikler der kan hjælpe os med at bygge intuitive brugergrænseflader til vores produkter.",
    contactPerson: "Lars Jensen",
    url: "https://example.com/job/frontend-developer",
    createdAt: new Date()
  }
];

export const mockCoverLetters: CoverLetter[] = [
  {
    id: "1",
    userId: "1",
    jobPostingId: "1",
    content: "Kære Maria Hansen,\n\nJeg skriver til dig angående stillingen som UX Designer hos Designbureau A/S. Med min baggrund i brugeroplevelse og digitalt design, er jeg overbevist om, at jeg kan bidrage til jeres kreative team.\n\nMed venlig hilsen,\nDemo User\nTlf: +45 12 34 56 78\nEmail: demo@example.com",
    createdAt: new Date()
  }
];
