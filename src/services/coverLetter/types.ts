
import { JobPosting, CoverLetter, User } from "@/lib/types";

export interface JobFormData {
  id?: string;
  title: string;
  company: string;
  description: string;
  contact_person?: string;
  url?: string;
  deadline?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  experience?: string;
  education?: string;
  skills?: string;
}
