
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import ResumeUploader from "./ResumeUploader";
import PersonalInfoFields from "./PersonalInfoFields";
import ExperienceField from "./ExperienceField";
import EducationField from "./EducationField";
import SkillsField from "./SkillsField";
import FormActions from "./FormActions";

interface PersonalInfoFormProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isLoading,
}) => {
  const handleExtractedData = (extractedData: Partial<PersonalInfoFormState>) => {
    setFormData(prev => ({
      ...prev,
      ...extractedData
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <ResumeUploader onExtractedData={handleExtractedData} />
      
      <PersonalInfoFields formData={formData} handleChange={handleChange} />
      
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

      <FormActions isLoading={isLoading} />
    </form>
  );
};

export default PersonalInfoForm;
