
import React, { useState } from "react";
import { User } from "../lib/types";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoFields from "./profile/PersonalInfoFields";
import PersonalInfoSummary from "./profile/PersonalInfoSummary";
import WorkExperienceField from "./profile/WorkExperienceField";
import EducationField from "./profile/EducationField";
import SkillsField from "./profile/SkillsField";
import SubmitButton from "./profile/SubmitButton";

interface PersonalInfoFormProps {
  user: User;
  onSave: (data: PersonalInfoFormData) => void;
  isLoading?: boolean;
}

interface PersonalInfoFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    summary: user.summary || "", // Use the summary from user object
    experience: "",
    education: "",
    skills: "",
  });
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form submission in PersonalInfoForm component");
    console.log("Form action:", (e.target as HTMLFormElement).action);
    console.log("Form method:", (e.target as HTMLFormElement).method);
    
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please provide at least your name and email",
        variant: "destructive",
      });
      return;
    }
    
    // Log network activity
    console.log("Network monitoring: About to call onSave with form data");
    onSave(formData);
    console.log("Network monitoring: onSave called");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <PersonalInfoFields 
          formData={formData} 
          handleChange={handleChange}
        />

        <PersonalInfoSummary 
          value={formData.summary} 
          onChange={handleChange} 
        />

        <WorkExperienceField 
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

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default PersonalInfoForm;
