
import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { ProfileState } from "./types";
import { useProfileValidation } from "./useProfileValidation";
import { useToast } from "@/hooks/use-toast";

export interface UseProfileFormProps {
  initialState: ProfileState;
  onSave: (formData: ProfileState) => Promise<void>;
}

export const useProfileForm = ({ initialState, onSave }: UseProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateForm, validationErrors, clearFieldError } = useProfileValidation();
  const { toast } = useToast();

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      toast({
        title: "Validering fejl",
        description: "Udfyld venligst alle påkrævede felter korrekt.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
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
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSave, toast]);

  return {
    formData,
    setFormData,
    isSubmitting,
    validationErrors,
    handleChange,
    handleSubmit,
    isFormValid: Object.keys(validationErrors).length === 0
  };
};
