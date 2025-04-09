import { User as SupabaseUser } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";
import { ExperienceEntry, EducationEntry, SkillEntry } from "@/types/resume";

export type JobPosting = Tables<"job_postings">;
export type CoverLetter = Tables<"cover_letters"> & {
  job_title?: string;
  company?: string;
  contact_person?: string;
};
export type Profile = Tables<"profiles"> & {
  structuredExperience?: ExperienceEntry[];
  structuredEducation?: EducationEntry[];
  structuredSkills?: SkillEntry[];
};

// Define Company type manually since it might not be in the generated types
export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}

// Extend the User type to be compatible with Supabase User type
export interface User extends Partial<SupabaseUser> {
  id: string;
  name?: string;
  profileComplete?: boolean;
  phone?: string;
  address?: string;
  summary?: string;  // Added summary property
  // Other custom properties can be added here
}
