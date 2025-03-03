import { User as SupabaseUser } from "@supabase/supabase-js";
import { Tables } from "@/integrations/supabase/types";

export type JobPosting = Tables<"job_postings">;
export type CoverLetter = Tables<"cover_letters">;
export type Profile = Tables<"profiles">;

// Extend the User type to be compatible with Supabase User type
export interface User extends Partial<SupabaseUser> {
  id: string;
  name?: string;
  profileComplete?: boolean;
  phone?: string;
  address?: string;
  // Other custom properties can be added here
}
