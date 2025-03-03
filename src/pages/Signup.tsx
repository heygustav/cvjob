
import React from "react";
import SignupForm from "@/components/signup/SignupForm";
import SignupLayout from "@/components/signup/SignupLayout";
import { useSignupHandler } from "@/hooks/useSignupHandler";

interface SignupProps {
  onSignup: (userId: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const { isLoading, handleSubmit } = useSignupHandler(onSignup);

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
