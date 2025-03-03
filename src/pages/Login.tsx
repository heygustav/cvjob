
import React from "react";
import LoginForm from "@/components/login/LoginForm";
import LoginLayout from "@/components/login/LoginLayout";
import { useAuth } from '@/components/AuthProvider';

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { isLoading, redirectUrl, handleAuthentication } = useAuth();

  const handleSubmit = async (email: string, password: string) => {
    await handleAuthentication(email, password, false);
    // If successful, the AuthProvider will automatically redirect
    // and we can call onLogin with the user ID later if needed
  };

  return (
    <LoginLayout redirectUrl={redirectUrl}>
      <LoginForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </LoginLayout>
  );
};

export default Login;
