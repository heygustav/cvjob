
import { useState, useEffect } from "react";
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
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      console.log("User is authenticated, fetching profile data", user.id);
      console.log("Supabase client initialized:", !!supabase);
      fetchProfile();
    } else {
      console.log("No authenticated user found");
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile data for user:", user?.id);
      setIsProfileLoading(true);
      
      console.log("Database connection test - starting query");
      const startTime = performance.now();
      
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      const endTime = performance.now();
      console.log(`Profile query completed in ${endTime - startTime}ms with status: ${status}`);
      
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      if (data) {
        console.log("Profile data fetched successfully:", data);
        setFormData({
          name: data.name || "",
          email: data.email || user?.email || "",
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
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Field "${name}" changed to: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submit triggered");
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Navn er påkrævet");
      }
      
      if (!formData.email.trim()) {
        throw new Error("Email er påkrævet");
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Ugyldig email adresse");
      }
      
      // Log the complete request payload for debugging
      const profileData = {
        id: user?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        updated_at: new Date().toISOString(),
      };
      
      console.log("About to save profile data with payload:", profileData);
      console.log("Current authenticated user:", user?.id);
      console.log("Database connection status check before saving...");
      
      // Verify database connection with a simple query
      const connectionTest = await supabase.from("profiles").select("count").limit(1);
      console.log("Database connection test result:", connectionTest);
      
      if (connectionTest.error) {
        console.error("Database connection test failed:", connectionTest.error);
        throw new Error("Kunne ikke forbinde til databasen. Prøv igen senere.");
      }
      
      // Track network request timing for performance debugging
      const startTime = performance.now();
      
      const { error, data, status } = await supabase.from("profiles").upsert(profileData);
      
      const endTime = performance.now();
      console.log(`Profile save completed in ${endTime - startTime}ms with status: ${status}`);
      console.log("Supabase response data:", data);

      if (error) {
        console.error("Error updating profile:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log("Profile updated successfully");
      toast({
        title: "Profil opdateret",
        description: "Dine profiloplysninger er blevet gemt.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Fejl ved opdatering",
        description: error instanceof Error ? error.message : "Der opstod en fejl under opdatering af din profil. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    isProfileLoading,
    handleChange,
    handleSubmit,
  };
};
