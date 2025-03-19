
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
  validationErrors?: Record<string, string>;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isLoading,
  validationErrors = {}
}) => {
  console.log("PersonalInfoForm rendering with data:", formData);
  console.log("Browser context:", navigator.userAgent);
  console.log("Viewport size:", window.innerWidth, "x", window.innerHeight);
  
  // Track invalid/valid fields for testing
  React.useEffect(() => {
    const requiredFields = {
      name: formData.name.trim() !== "",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    };
    console.log("Form validation state:", requiredFields);
  }, [formData.name, formData.email]);
  
  const handleExtractedData = (extractedData: Partial<PersonalInfoFormState>) => {
    console.log("Received extracted data from resume:", extractedData);
    console.log("Browser context for resume extraction:", navigator.userAgent);
    setFormData(prev => ({
      ...prev,
      ...extractedData
    }));
  };

  // Validate if form is ready to submit
  const isFormValid = React.useMemo(() => {
    return formData.name.trim() !== "" && 
      formData.email.trim() !== "" && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      Object.keys(validationErrors).length === 0;
  }, [formData.name, formData.email, validationErrors]);

  const onSubmit = (e: React.FormEvent) => {
    console.log("Form submission in PersonalInfoForm");
    console.log("Browser context for submission:", navigator.userAgent);
    e.preventDefault(); // Prevent default form submission behavior
    
    // Additional validation before submission
    if (!isFormValid) {
      console.log("Form validation prevented submission");
      return;
    }
    
    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 text-left">
      <ResumeUploader onExtractedData={handleExtractedData} />
      
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
  );
};

export default PersonalInfoForm;
