
import React from "react";
import ProfileHeader from "./ProfileHeader";
import ProfilePersonalInfo from "./ProfilePersonalInfo";
import ProfileAccountSettings from "./ProfileAccountSettings";
import { PersonalInfoFormState } from "@/pages/Profile";

interface ProfileContainerProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isLoading,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <ProfileHeader
          title="Min profil"
          subtitle="Administrer dine personlige oplysninger"
        />

        <ProfilePersonalInfo
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setFormData={setFormData}
          isLoading={isLoading}
        />

        <ProfileAccountSettings />
      </div>
    </div>
  );
};

export default ProfileContainer;
