
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./types";
import { EmailPreferences } from "@/components/profile/EmailPreferences";

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

export const fetchEmailPreferences = async (userId: string): Promise<EmailPreferences> => {
  console.log("Fetching email preferences for user:", userId);
  
  const { data, error } = await supabase
    .from("profiles")
    .select("email_preferences")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching email preferences:", error);
    return {
      jobAlerts: true,
      newsletters: true,
      accountUpdates: true
    };
  }

  const preferences = data.email_preferences as any;
  
  return {
    jobAlerts: typeof preferences.jobAlerts === 'boolean' ? preferences.jobAlerts : true,
    newsletters: typeof preferences.newsletters === 'boolean' ? preferences.newsletters : true,
    accountUpdates: typeof preferences.accountUpdates === 'boolean' ? preferences.accountUpdates : true
  };
};

export const updateEmailPreferences = async (
  userId: string, 
  preferences: EmailPreferences
): Promise<void> => {
  console.log("Updating email preferences for user:", userId);
  
  const { error } = await supabase
    .from("profiles")
    .update({
      email_preferences: preferences
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating email preferences:", error);
    throw error;
  }
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
  console.log("Deleting user account:", userId);
  
  // First delete the profile data
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) {
    console.error("Error deleting profile:", profileError);
    throw profileError;
  }

  // Then delete the user account
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) {
    console.error("Error deleting user account:", authError);
    throw authError;
  }
};
