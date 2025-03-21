
import React from 'react';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  redirectUrl: string | null;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children, redirectUrl }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Skip to content link for accessibility */}
      <a href="#auth-form" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:font-medium focus:rounded-md focus:shadow-md">
        Gå til login formular
      </a>
      
      {/* Celebration emoji background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none celebration-emoji-pattern" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dominant-baseline='middle' transform='rotate(10 60 60)'%3E🎉%3C/text%3E%3C/svg%3E")`,
             backgroundSize: '120px 120px'
           }}
           aria-hidden="true">
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 id="auth-title" className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h1>
          
          {redirectUrl && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md" role="status" aria-live="polite">
              <p className="text-sm text-amber-800">
                Log ind for at fortsætte til ansøgningsgeneratoren
              </p>
            </div>
          )}
        </div>
        
        <div id="auth-form">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
