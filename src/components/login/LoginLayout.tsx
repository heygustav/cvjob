
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface LoginLayoutProps {
  children: React.ReactNode;
  redirectUrl: string | null;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children, redirectUrl }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
      {/* Celebration emoji background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none celebration-emoji-pattern" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dominant-baseline='middle' transform='rotate(15 60 60)'%3E🎉%3C/text%3E%3C/svg%3E")`,
             backgroundSize: '120px 120px'
           }}>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-6 sm:p-8">
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
          
          <CardContent className="p-6 sm:p-8 pt-8 bg-white">
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
