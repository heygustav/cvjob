import React, { useState, useEffect } from "react";
import ProfileLoader from "@/components/profile/ProfileLoader";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { useProfileData } from "@/hooks/useProfileData";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import StatusContainer from "@/components/profile/status/StatusContainer";

// Define the type for the form data
export type PersonalInfoFormState = ProfileState & {
  photo?: string;
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>("checking");
  const [dbStatus, setDbStatus] = useState<string>("checking");
  const [browserInfo, setBrowserInfo] = useState<string>("");
  
  const {
    formData,
    setFormData,
    isLoading,
    isProfileLoading,
    handleChange,
    handleSubmit,
    validationErrors
  } = useProfileData();

  // Store browser information for debugging
  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      cookiesEnabled: navigator.cookieEnabled,
      language: navigator.language
    };
    
    setBrowserInfo(JSON.stringify(info, null, 2));
    console.log("Browser environment:", info);
    
    // Listen for window resize events for responsiveness testing
    const handleResize = () => {
      console.log("Window resized:", window.innerWidth, "x", window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verify authentication and database connection on mount
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        console.log("Browser: ", navigator.userAgent);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          console.error("Browser context:", navigator.userAgent);
          setAuthStatus("error");
          setError(`Autentificeringsfejl: ${error.message}`);
          return;
        }
        
        setAuthStatus(data.session ? "authenticated" : "unauthenticated");
        console.log("Authentication status:", data.session ? "authenticated" : "unauthenticated");
      } catch (err) {
        console.error("Auth check exception:", err);
        console.error("Browser info:", navigator.userAgent);
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
          console.error("Browser context:", navigator.userAgent);
          setDbStatus("error");
          setError(`Databasefejl: ${error.message}`);
          return;
        }
        
        setDbStatus("connected");
        console.log("Database connection status: connected");
      } catch (err) {
        console.error("Database check exception:", err);
        console.error("Browser info:", navigator.userAgent);
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
      <StatusContainer
        error={error}
        authStatus={authStatus}
        dbStatus={dbStatus}
        browserInfo={browserInfo}
      />
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
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default Profile;
