
import React from 'react';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  redirectUrl: string | null;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children, redirectUrl }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          
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
  );
};

export default AuthLayout;
