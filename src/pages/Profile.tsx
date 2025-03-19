
import React, { useState } from "react";
import ProfileLoader from "@/components/profile/ProfileLoader";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { useProfileData } from "@/hooks/useProfileData";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useAuth } from "@/components/AuthProvider";

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
  
  const {
    formData,
    setFormData,
    isLoading,
    isProfileLoading,
    handleChange,
    handleSubmit,
  } = useProfileData();

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
