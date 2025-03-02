
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import PersonalInfoForm from "@/components/profile/PersonalInfoForm";

interface ProfilePersonalInfoProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
}

const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isLoading,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div className="p-6">
        <PersonalInfoForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          setFormData={setFormData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
