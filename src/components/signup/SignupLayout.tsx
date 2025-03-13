
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface SignupLayoutProps {
  children: React.ReactNode;
}

const SignupLayout: React.FC<SignupLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 p-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              Opret din konto
            </h2>
            <p className="mt-2 text-center text-sm text-primary-100">
              Har du allerede en konto?{" "}
              <Link
                to="/login"
                className="font-medium text-white hover:text-primary-50 underline transition-colors"
              >
                Log ind
              </Link>
            </p>
          </div>
          
          <CardContent className="p-6 pt-8 bg-white">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupLayout;
