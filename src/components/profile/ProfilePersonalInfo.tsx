
import React, { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import PersonalInfoFields from "./PersonalInfoFields";
import ExperienceField from "./ExperienceField";
import EducationField from "./EducationField";
import SkillsField from "./SkillsField";
import FormActions from "./FormActions";

export interface ProfilePersonalInfoProps {
  formData: PersonalInfoFormState;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setFormData: Dispatch<SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
  validationErrors?: Record<string, string>;
}

const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  setFormData, 
  isLoading,
  validationErrors = {}
}) => {
  // Validate if form is ready to submit
  const isFormValid = React.useMemo(() => {
    return formData.name.trim() !== "" && 
      formData.email.trim() !== "" && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      Object.keys(validationErrors).length === 0;
  }, [formData.name, formData.email, validationErrors]);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Additional validation before submission
    if (!isFormValid) {
      return;
    }
    
    try {
      await handleSubmit(e);
    } catch (error) {
      console.error("Form submission failed with error:", error);
    }
  };

  return (
    <div className="space-y-6 p-8 text-left">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Personlige oplysninger</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Disse oplysninger bruges til at generere dine ansøgninger
        </p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-6 text-left">
        <PersonalInfoFields 
          formData={formData} 
          handleChange={handleChange} 
          validationErrors={validationErrors} 
        />
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <ExperienceField 
            value={formData.experience} 
            onChange={handleChange} 
          />
          
          <EducationField 
            value={formData.education} 
            onChange={handleChange} 
          />
          
          <SkillsField 
            value={formData.skills} 
            onChange={handleChange} 
          />
        </div>

        <FormActions isLoading={isLoading} isFormValid={isFormValid} />
      </form>
    </div>
  );
};

export default ProfilePersonalInfo;
