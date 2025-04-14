
import React from "react";
import { toast } from "sonner";
import PersonalInfoFields from "./profile/PersonalInfoFields";
import ExperienceField from "./profile/ExperienceField";
import EducationField from "./profile/EducationField";
import SkillsField from "./profile/SkillsField";
import ProfileFormLayout from "./profile/ProfileFormLayout";

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
  const [formData, setFormData] = React.useState<PersonalInfoFormState>({
    name: "",
    phone: "",
    address: "",
    summary: "",
    workExperiences: [],
    education: [],
    skills: [],
  });

  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (event: React.FormEvent) => {
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
    <ProfileFormLayout
      title="Personlige oplysninger"
      description="Opdater dine personlige oplysninger."
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      isFormValid={isValid}
    >
      <PersonalInfoFields 
        formData={formData} 
        handleChange={handleChange} 
        validationErrors={validationErrors}
      />
      
      <ExperienceField 
        value={formData.workExperiences.join("\n")}
        onChange={(e) => {
          const experiences = e.target.value.split("\n").filter(exp => exp.trim() !== "");
          setFormData({ ...formData, workExperiences: experiences });
        }}
      />
      
      <EducationField 
        value={formData.education.join("\n")}
        onChange={(e) => {
          const educations = e.target.value.split("\n").filter(edu => edu.trim() !== "");
          setFormData({ ...formData, education: educations });
        }}
      />
      
      <SkillsField 
        value={formData.skills.join("\n")}
        onChange={(e) => {
          const skillsList = e.target.value.split("\n").filter(skill => skill.trim() !== "");
          setFormData({ ...formData, skills: skillsList });
        }}
      />
    </ProfileFormLayout>
  );
};

export default PersonalInfoForm;
