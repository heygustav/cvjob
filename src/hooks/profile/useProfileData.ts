
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { ProfileState, ValidationErrors, UseProfileDataReturn } from "./types";
import { useProfileFetch } from "./useProfileFetch";
import { useProfileSubmit } from "./useProfileSubmit";
import { useProfileValidation } from "./useProfileValidation";

/**
 * Main hook for profile data management
 * This combines fetch, validation, and submission logic
 */
export const useProfileData = (): UseProfileDataReturn => {
  const [formData, setFormData] = useState<ProfileState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    education: "",
    skills: "",
    summary: ""
  });

  // Use individual hooks for specific functionality
  const { isProfileLoading, fetchProfile } = useProfileFetch(setFormData);
  const { isLoading: isSubmitting, handleSubmit: submitProfile } = useProfileSubmit();
  const { validationErrors, validateForm, clearFieldError } = useProfileValidation();

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear validation error when field is edited
    clearFieldError(name);
    
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<Element>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }
    
    await submitProfile(formData);
  };

  // Load profile data when component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    formData,
    setFormData,
    isLoading: isSubmitting,
    isProfileLoading,
    handleChange,
    handleSubmit,
    validationErrors,
    refreshProfile: fetchProfile,
  };
};
