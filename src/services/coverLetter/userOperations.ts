
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  console.log("Fetching user profile data for user:", userId);
  
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error fetching profile:", profileError);
  }

  if (!profile) {
    return {
      name: "",
      email: "",
      phone: "",
      address: "",
      experience: "",
      education: "",
      skills: ""
    };
  }

  return profile as UserProfile;
};
