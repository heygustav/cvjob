
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobPosting } from "../lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import UrlField from "./job-form/UrlField";
import JobDescriptionField from "./job-form/JobDescriptionField";
import JobInfoFields from "./job-form/JobInfoFields";
import SubmitButton from "./job-form/SubmitButton";
import { useTimer } from "./job-form/useTimer";
import { useJobExtraction } from "./job-form/useJobExtraction";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { saveOrUpdateJob } from "@/services/coverLetter/database";

interface JobPostingFormProps {
  onSubmit: (jobData: JobFormData) => void;
  onSave?: (jobData: JobFormData) => Promise<void>;
  initialData?: JobPosting;
  isLoading?: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  onSubmit,
  onSave,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || "",
    company: initialData?.company || "",
    description: initialData?.description || "",
    contact_person: initialData?.contact_person || "",
    url: initialData?.url || "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { elapsed, formattedTime, resetTimer } = useTimer(isLoading);
  const { isExtracting, extractInfoFromDescription } = useJobExtraction(formData, setFormData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Jobtitel er påkrævet";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Virksomhedsnavn er påkrævet";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Jobbeskrivelse er påkrævet";
    } else if (formData.description.trim().length < 100) {
      newErrors.description = "Jobbeskrivelse skal være på mindst 100 tegn";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit triggered", formData);

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      toast({
        title: "Fejl i formular",
        description: "Udfyld venligst alle påkrævede felter korrekt.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form validation passed, proceeding with submission");
    resetTimer();
    
    try {
      console.log("Calling onSubmit with form data", formData);
      onSubmit(formData);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Fejl ved afsendelse",
        description: "Der opstod en fejl ved afsendelse af formularen.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UrlField 
        value={formData.url} 
        onChange={handleChange} 
        disabled={isLoading || isSaving} 
      />

      <div className="space-y-6">
        <JobDescriptionField 
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading || isSaving}
          onExtract={extractInfoFromDescription}
          isExtracting={isExtracting}
          error={errors.description}
        />

        <JobInfoFields 
          title={formData.title}
          company={formData.company}
          contactPerson={formData.contact_person}
          onChange={handleChange}
          disabled={isLoading || isSaving}
          errors={errors}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
        <SubmitButton 
          isLoading={isLoading} 
          elapsedTime={formattedTime}
          className="w-full"
        />
      </div>
    </form>
  );
};

export default JobPostingForm;
