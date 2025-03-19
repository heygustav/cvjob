import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import PersonalInfoFields from "./profile/PersonalInfoFields";
import WorkExperienceField from "./profile/WorkExperienceField";
import EducationField from "./profile/EducationField";
import SkillsField from "./profile/SkillsField";
import FormActions from "./profile/FormActions";

export interface PersonalInfoFormData {
  name: string;
  phone: string;
  address: string;
  workExperiences: string[];
  education: string[];
  skills: string[];
  summary?: string;
}

export interface PersonalInfoFormState {
  name: string;
  phone: string;
  address: string;
  summary: string;
  workExperiences: string[];
  education: string[];
  skills: string[];
}

const PersonalInfoForm: React.FC = () => {
  const [formData, setFormData] = useState<PersonalInfoFormState>({
    name: "",
    phone: "",
    address: "",
    summary: "",
    workExperiences: [],
    education: [],
    skills: [],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    let errors: Record<string, string> = {};

    if (!formData.name) {
      errors.name = "Navn er påkrævet";
    }

    if (!formData.phone) {
      errors.phone = "Telefonnummer er påkrævet";
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = "Telefonnummer skal kun indeholde tal";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error for the field being changed
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Der er fejl i formularen. Tjek venligst.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profil gemt!");
    } catch (error) {
      toast.error("Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isValid = Object.keys(validationErrors).length === 0 && formData.name !== "" && formData.phone !== "";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PersonalInfoFields 
        formData={formData} 
        handleChange={handleChange} 
        validationErrors={validationErrors}
      />
      
      <WorkExperienceField 
        workExperiences={formData.workExperiences}
        setWorkExperiences={(experiences) => {
          setFormData({ ...formData, workExperiences: experiences });
        }}
      />
      
      <EducationField 
        education={formData.education}
        setEducation={(education) => {
          setFormData({ ...formData, education });
        }}
      />
      
      <SkillsField 
        skills={formData.skills}
        setSkills={(skills) => {
          setFormData({ ...formData, skills });
        }}
      />
      
      <FormActions isLoading={isSubmitting} isFormValid={isValid} />
    </form>
  );
};

export default PersonalInfoForm;
