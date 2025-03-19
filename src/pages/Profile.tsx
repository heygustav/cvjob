
import React, { useState, useEffect } from "react";
import ProfileLoader from "@/components/profile/ProfileLoader";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { useProfileData } from "@/hooks/useProfileData";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

// Define the type for the form data
export interface PersonalInfoFormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  education: string;
  skills: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>("checking");
  const [dbStatus, setDbStatus] = useState<string>("checking");
  
  const {
    formData,
    setFormData,
    isLoading,
    isProfileLoading,
    handleChange,
    handleSubmit,
  } = useProfileData();

  // Verify authentication and database connection on mount
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          setAuthStatus("error");
          setError(`Autentificeringsfejl: ${error.message}`);
          return;
        }
        
        setAuthStatus(data.session ? "authenticated" : "unauthenticated");
        console.log("Authentication status:", data.session ? "authenticated" : "unauthenticated");
      } catch (err) {
        console.error("Auth check exception:", err);
        setAuthStatus("error");
      }
    };
    
    // Check database connection status
    const checkDatabase = async () => {
      try {
        console.log("Testing database connection...");
        const startTime = performance.now();
        
        const { data, error } = await supabase.from("profiles").select("count").limit(1);
        
        const endTime = performance.now();
        console.log(`Database connection test took ${endTime - startTime}ms`);
        
        if (error) {
          console.error("Database connection error:", error);
          setDbStatus("error");
          setError(`Databasefejl: ${error.message}`);
          return;
        }
        
        setDbStatus("connected");
        console.log("Database connection status: connected");
      } catch (err) {
        console.error("Database check exception:", err);
        setDbStatus("error");
      }
    };

    checkAuth();
    checkDatabase();
  }, []);

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <ErrorDisplay 
            title="Login påkrævet" 
            message="Du skal være logget ind for at se din profil."
            phase="user-fetch"
          />
        </div>
      </div>
    );
  }

  if (authStatus === "error" || dbStatus === "error") {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <ErrorDisplay 
            title="Forbindelsesfejl" 
            message={error || "Der opstod en fejl ved forbindelsen til serveren."}
            onRetry={() => window.location.reload()}
            phase="user-fetch"
          />
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Teknisk information:</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Autentificeringsstatus</dt>
                <dd className="mt-1 text-sm text-gray-900">{authStatus}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Databasestatus</dt>
                <dd className="mt-1 text-sm text-gray-900">{dbStatus}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  }

  if (isProfileLoading) {
    return <ProfileLoader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      {error && (
        <div className="max-w-3xl mx-auto mb-6">
          <ErrorDisplay 
            title="Fejl" 
            message={error}
            onRetry={() => setError(null)}
            phase="user-fetch"
          />
        </div>
      )}
      
      <ProfileContainer
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Profile;
