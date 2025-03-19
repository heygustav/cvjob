
import { useState, useCallback } from "react";
import { ProfileState } from "./types";
import { useProfileValidation } from "./useProfileValidation";

export const useProfileForm = (initialState: ProfileState) => {
  const [formData, setFormData] = useState<ProfileState>(initialState);
  const { validationErrors, validateForm, clearFieldError } = useProfileValidation();

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Clear validation error when field is edited
    clearFieldError(name);
    
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [clearFieldError]);

  return {
    formData,
    setFormData,
    validationErrors,
    validateForm,
    handleChange
  };
};
