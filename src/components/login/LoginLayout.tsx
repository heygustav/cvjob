
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface LoginLayoutProps {
  children: React.ReactNode;
  redirectUrl: string | null;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children, redirectUrl }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              Velkommen tilbage
            </h2>
            <p className="mt-2 text-center text-sm text-primary-100">
              Har du ikke en konto?{" "}
              <Link
                to="/signup"
                className="font-medium text-white hover:text-primary-50 underline transition-colors"
              >
                Opret konto
              </Link>
            </p>
          </div>
          
          <CardContent className="p-6 pt-8 bg-white">
            {redirectUrl && (
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  Log ind for at fortsætte til ansøgningsgeneratoren
                </p>
              </div>
            )}
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginLayout;
