
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useSignupValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: SignupFormData) => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Adgangskode fejl",
        description: "Adgangskoderne stemmer ikke overens",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Adgangskode fejl",
        description: "Adgangskoden skal være mindst 8 tegn",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    validateForm,
  };
};
