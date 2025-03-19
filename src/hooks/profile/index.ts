
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useProfileForm } from "./useProfileForm";
import { useProfileFetch } from "./useProfileFetch";
import { useProfileSubmit } from "./useProfileSubmit";
import { UseProfileDataReturn, ProfileState } from "./types";

// Export type definitions for consumers
export * from "./types";

export const useProfileData = (): UseProfileDataReturn => {
  const { user } = useAuth();
  
  // Initialize with empty profile state
  const initialState: ProfileState = {
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    experience: "",
    education: "",
    skills: "",
    summary: "",
  };

  // Form handling
  const { formData, setFormData, validationErrors, validateForm, handleChange } = useProfileForm(initialState);
  
  // Profile fetching
  const { isProfileLoading, fetchProfile } = useProfileFetch(setFormData);
  
  // Form submission
  const { isLoading, handleSubmit } = useProfileSubmit(validateForm);

  // Fetch profile on initial load
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setFormData(initialState);
    }
  }, [user, fetchProfile, setFormData]);

  // Wrap handleSubmit to include form data
  const submitForm = async (e: React.FormEvent) => {
    await handleSubmit(e, formData);
  };

  return {
    formData,
    setFormData,
    isLoading,
    isProfileLoading,
    handleChange,
    handleSubmit: submitForm,
    validationErrors,
    refreshProfile: fetchProfile
  };
};
