
import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileState } from "./types";

export const useProfileSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const submitProfile = useCallback(async (formData: ProfileState) => {
    if (!user?.id) {
      toast({
        title: "Fejl ved opdatering",
        description: "Bruger-ID mangler. Prøv at logge ind igen.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSubmitting(true);

    try {      
      const profileData = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        summary: formData.summary,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        has_completed_onboarding: true,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase.from("profiles").upsert(profileData);

      if (error) {
        throw error;
      }

      toast({
        title: "Profil opdateret",
        description: "Dine profiloplysninger er blevet gemt.",
      });
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Der opstod en fejl under opdatering af din profil. Prøv venligst igen.";
      
      toast({
        title: "Fejl ved opdatering",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, toast]);

  return {
    isSubmitting,
    submitProfile
  };
};
