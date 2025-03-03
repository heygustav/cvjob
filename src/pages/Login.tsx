
import React from "react";
import LoginForm from "@/components/login/LoginForm";
import LoginLayout from "@/components/login/LoginLayout";
import { useLoginHandler } from "@/hooks/useLoginHandler";

interface LoginProps {
  onLogin: (userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { isLoading, redirectUrl, handleSubmit } = useLoginHandler(onLogin);

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
