
import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileState } from "./types";

export const useProfileSubmit = (validateForm: (formData: ProfileState) => boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = useCallback(async (
    e: React.FormEvent,
    formData: ProfileState
  ) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      toast({
        title: "Validation fejl",
        description: "Udfyld venligst alle påkrævede felter korrekt.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user?.id) {
      toast({
        title: "Fejl ved opdatering",
        description: "Bruger-ID mangler. Prøv at logge ind igen.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {      
      const profileData = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
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
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, validateForm]);

  return {
    isLoading,
    handleSubmit
  };
};
