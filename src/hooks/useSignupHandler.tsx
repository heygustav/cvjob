
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSignupValidation } from "./useSignupValidation";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useSignupHandler = (onSignup: (userId: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateForm } = useSignupValidation();

  const handleSubmit = async (formData: SignupFormData) => {
    if (!validateForm(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate signup process
      setTimeout(() => {
        // In a real app, this would send data to a server to create an account
        const newUserId = "new-user-" + Date.now();
        onSignup(newUserId);
        
        toast({
          title: "Konto oprettet",
          description: "Din konto er blevet oprettet med succes!",
        });
        
        navigate("/dashboard");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: "Oprettelse mislykkedes",
        description: "Der opstod en fejl under oprettelse af kontoen",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};
