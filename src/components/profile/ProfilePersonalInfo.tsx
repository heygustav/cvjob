
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import PersonalInfoFields from "./PersonalInfoFields";
import ExperienceField from "./ExperienceField";
import EducationField from "./EducationField";
import SkillsField from "./SkillsField";
import ProfileFormLayout from "./ProfileFormLayout";

export interface ProfilePersonalInfoProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
  validationErrors?: Record<string, string>;
}

const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  isLoading,
  validationErrors = {}
}) => {
  // Validate if form is ready to submit
  const isFormValid = React.useMemo(() => {
    return formData.name?.trim() !== "" && 
      formData.email?.trim() !== "" && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "") &&
      Object.keys(validationErrors).length === 0;
  }, [formData.name, formData.email, validationErrors]);

  return (
    <ProfileFormLayout
      title="Personlige oplysninger"
      description="Disse oplysninger bruges til at generere dine ansøgninger"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isFormValid={isFormValid}
    >
      <PersonalInfoFields 
        formData={formData} 
        handleChange={handleChange} 
        validationErrors={validationErrors} 
      />
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <ExperienceField 
          value={formData.experience || ""} 
          onChange={handleChange} 
        />
        
        <EducationField 
          value={formData.education || ""} 
          onChange={handleChange} 
        />
        
        <SkillsField 
          value={formData.skills || ""} 
          onChange={handleChange} 
        />
      </div>
    </ProfileFormLayout>
  );
};

export default ProfilePersonalInfo;
