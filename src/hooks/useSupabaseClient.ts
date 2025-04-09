
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for providing the Supabase client instance
 * @returns The Supabase client instance
 */
export const useSupabaseClient = () => {
  return supabase;
};
