
import { useState, useEffect, useCallback, useRef } from "react";
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
  
  // Refs for performance tracking
  const fetchStartTime = useRef<number | null>(null);
  const saveStartTime = useRef<number | null>(null);
  
  // For testing persistence between page refreshes
  useEffect(() => {
    // Store last page visit timestamp in localStorage for persistence testing
    const lastVisit = localStorage.getItem('profileLastVisit');
    const currentTime = new Date().toISOString();
    console.log(`Previous profile page visit: ${lastVisit || 'First visit'}`);
    localStorage.setItem('profileLastVisit', currentTime);
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching profile");
      setIsProfileLoading(false);
      return;
    }
    
    try {
      console.log("Fetching profile data for user:", user.id);
      console.log("Browser info:", navigator.userAgent);
      setIsProfileLoading(true);
      
      // Start performance measurement
      fetchStartTime.current = performance.now();
      console.log("Database connection test - starting query");
      
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // End performance measurement
      const fetchDuration = fetchStartTime.current ? performance.now() - fetchStartTime.current : null;
      console.log(`Profile query completed in ${fetchDuration?.toFixed(2)}ms with status: ${status}`);
      
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          browser: navigator.userAgent
        });
        throw error;
      }

      if (data) {
        console.log("Profile data fetched successfully");
        setFormData({
          name: data.name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          experience: data.experience || "",
          education: data.education || "",
          skills: data.skills || "",
        });
        
        // Verify persistence by comparing with localStorage cached values
        const cachedFormData = localStorage.getItem('profileFormData');
        if (cachedFormData) {
          try {
            const parsedCache = JSON.parse(cachedFormData);
            console.log("Data persistence check - comparing server data with cached data:", 
              JSON.stringify(parsedCache) === JSON.stringify(data) ? "Matching" : "Different");
          } catch (e) {
            console.error("Error parsing cached form data:", e);
          }
        }
        
        // Cache current form data for persistence testing
        localStorage.setItem('profileFormData', JSON.stringify(data));
      } else {
        console.log("No profile data found for user - will create on first save");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      console.error("Browser environment:", {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        platform: navigator.platform
      });
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
      console.log("Supabase client initialized:", !!supabase);
      fetchProfile();
    } else {
      console.log("No authenticated user found");
      setIsProfileLoading(false);
    }
  }, [user, fetchProfile]);

  const validateForm = useCallback(() => {
    console.log("Validating form data");
    const errors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.name.trim()) {
      errors.name = "Navn er påkrævet";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email er påkrævet";
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Ugyldig email adresse";
      }
    }
    
    // Set validation errors and return whether the form is valid
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.name, formData.email]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Field "${name}" changed to: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
    
    // Clear validation error for this field when user makes changes
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
    console.log("Form submit triggered");
    console.log("Browser context:", navigator.userAgent);
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      console.log("Form validation failed:", validationErrors);
      toast({
        title: "Validation fejl",
        description: "Udfyld venligst alle påkrævede felter korrekt.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user?.id) {
      console.error("No user ID available for saving profile");
      toast({
        title: "Fejl ved opdatering",
        description: "Bruger-ID mangler. Prøv at logge ind igen.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    saveStartTime.current = performance.now();

    try {      
      // Log the complete request payload for debugging
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
      
      console.log("About to save profile data");
      console.log("Current authenticated user:", user.id);
      console.log("Database connection status check before saving...");
      
      // Verify database connection with a simple query
      const connectionTest = await supabase.from("profiles").select("count").limit(1);
      console.log("Database connection test result:", connectionTest);
      
      if (connectionTest.error) {
        console.error("Database connection test failed:", connectionTest.error);
        throw new Error("Kunne ikke forbinde til databasen. Prøv igen senere.");
      }
      
      // Track network request timing for performance debugging
      console.log("Starting profile save operation");
      
      const { error, status } = await supabase.from("profiles").upsert(profileData);
      
      // End performance measurement
      const saveDuration = saveStartTime.current ? performance.now() - saveStartTime.current : null;
      console.log(`Profile save completed in ${saveDuration?.toFixed(2)}ms with status: ${status}`);

      if (error) {
        console.error("Error updating profile:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          browser: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`
        });
        throw error;
      }

      console.log("Profile updated successfully");
      
      // Update localStorage cache for persistence testing
      localStorage.setItem('profileFormData', JSON.stringify(profileData));
      
      toast({
        title: "Profil opdateret",
        description: "Dine profiloplysninger er blevet gemt.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Browser environment on error:", {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        platform: navigator.platform,
        cookiesEnabled: navigator.cookieEnabled
      });
      
      // Show more specific error messages based on error types
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
      saveStartTime.current = null;
    }
  }, [formData, user, toast, validateForm, validationErrors]);

  return {
    formData,
    setFormData,
    isLoading,
    isProfileLoading,
    handleChange,
    handleSubmit,
    validationErrors,
    refreshProfile: fetchProfile // Exported for end-to-end testing
  };
};
