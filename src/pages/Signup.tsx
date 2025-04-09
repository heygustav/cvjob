
import React from "react";
import SignupForm from "@/components/signup/SignupForm";
import SignupLayout from "@/components/signup/SignupLayout";
import { useAuth } from '@/components/AuthProvider';

interface SignupProps {
  onSignup: (userId: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const { isLoading, handleAuthentication } = useAuth();

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
    gdpr: boolean;
  }) => {
    // Ensure both checkboxes are checked
    if (!formData.terms || !formData.gdpr) {
      return;
    }
    
    await handleAuthentication(formData.email, formData.password, true, formData.name);
    // If successful, the AuthProvider will automatically redirect
    // and we can call onSignup with the user ID later if needed
  };

  return (
    <SignupLayout>
      <SignupForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </SignupLayout>
  );
};

export default Signup;
