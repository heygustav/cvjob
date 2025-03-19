
import { useState, useCallback } from "react";
import { ProfileState, ValidationErrors } from "./types";

export const useProfileValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback((formData: ProfileState) => {
    const errors: ValidationErrors = {};
    
    if (!formData.name?.trim()) {
      errors.name = "Navn er påkrævet";
    }
    
    if (!formData.email?.trim()) {
      errors.email = "Email er påkrævet";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Ugyldig email adresse";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  }, [validationErrors]);

  return {
    validationErrors,
    validateForm,
    clearFieldError
  };
};
