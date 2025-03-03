
import React from "react";
import { Link } from "react-router-dom";

interface LoginLayoutProps {
  children: React.ReactNode;
  redirectUrl: string | null;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children, redirectUrl }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Velkommen tilbage
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Har du ikke en konto?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary-700"
              >
                Opret konto
              </Link>
            </p>
            
            {redirectUrl && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  Log ind for at fortsætte til ansøgningsgeneratoren
                </p>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
