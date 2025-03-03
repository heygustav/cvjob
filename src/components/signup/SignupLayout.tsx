
import React from "react";
import { Link } from "react-router-dom";

interface SignupLayoutProps {
  children: React.ReactNode;
}

const SignupLayout: React.FC<SignupLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Opret din konto
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Har du allerede en konto?{" "}
              <Link
                to="/login"
                className="font-medium text-black hover:text-gray-800"
              >
                Log ind
              </Link>
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SignupLayout;
