
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFormState } from "@/pages/Profile";

export const useProfileData = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PersonalInfoFormState>({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching profile");
      setIsProfileLoading(false);
      return;
    }
    
    try {
      console.log("Fetching profile data for user:", user.id);
      setIsProfileLoading(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();  // Changed from single() to maybeSingle() to prevent errors if no profile exists

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        console.log("Profile data fetched successfully", data);
        setFormData({
          name: data.name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          experience: data.experience || "",
          education: data.education || "",
          skills: data.skills || "",
        });
      } else {
        console.log("No profile data found for user - will create on first save");
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
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      console.log("User is authenticated, fetching profile data", user.id);
      fetchProfile();
    } else {
      console.log("No authenticated user found");
      setIsProfileLoading(false);
    }
  }, [user, fetchProfile]);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Navn er påkrævet";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email er påkrævet";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Ugyldig email adresse";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.name, formData.email]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [validationErrors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
      
      let errorMessage = "Der opstod en fejl under opdatering af din profil. Prøv venligst igen.";
      
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage = "Netværksfejl. Kontroller din internetforbindelse og prøv igen.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Serveren svarer ikke. Prøv igen senere.";
        } else if (error.message.includes("duplicate")) {
          errorMessage = "Denne email er allerede i brug.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Fejl ved opdatering",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, user, toast, validateForm]);

  return {
    formData,
    setFormData,
    isLoading,
    isProfileLoading,
    handleChange,
    handleSubmit,
    validationErrors,
    refreshProfile: fetchProfile
  };
};
