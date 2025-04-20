
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import PersonalInfoFields from "./PersonalInfoFields";
import ExperienceField from "./ExperienceField";
import EducationField from "./EducationField";
import SkillsField from "./SkillsField";
import ProfileFormLayout from "./ProfileFormLayout";
import { useProfileValidation } from "@/hooks/profile/useProfileValidation";

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
  validationErrors: externalValidationErrors
}) => {
  const { 
    validationErrors: internalValidationErrors,
    validateField,
    validateForm,
    handleBlur,
    isFieldTouched
  } = useProfileValidation();

  // Merge validation errors if external ones are provided
  const validationErrors = externalValidationErrors || internalValidationErrors;

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm(formData)) {
      await handleSubmit(e);
    }
  };

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
      onSubmit={handleFormSubmit}
      isLoading={isLoading}
      isFormValid={isFormValid}
    >
      <PersonalInfoFields 
        formData={formData} 
        handleChange={handleChange} 
        validationErrors={validationErrors}
        validateField={validateField}
        handleBlur={handleBlur}
        isFieldTouched={isFieldTouched}
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
