
import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileState } from "./types";

export const useProfileFetch = (setFormData: React.Dispatch<React.SetStateAction<ProfileState>>) => {
  const { user } = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching profile");
      setIsProfileLoading(false);
      return;
    }
    
    try {
      setIsProfileLoading(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        setFormData({
          name: data.name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          summary: data.summary || "",
          experience: data.experience || "",
          education: data.education || "",
          skills: data.skills || "",
        });
      } else {
        // No profile data found, just use the email from user object
        setFormData(prev => ({
          ...prev,
          email: user.email || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Fejl ved indlæsning af profil",
        description: "Der opstod en fejl under indlæsning af din profil. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsProfileLoading(false);
    }
  }, [user, toast, setFormData]);

  // Add the missing refreshProfile method
  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return {
    isProfileLoading,
    fetchProfile,
    refreshProfile
  };
};
