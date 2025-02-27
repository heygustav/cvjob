
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

interface JobPostingFormProps {
  onSubmit: (jobData: JobFormData) => void;
  initialData?: JobPosting;
  isLoading?: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  onSubmit,
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
  
  const { toast } = useToast();
  const { elapsed, formattedTime, resetTimer } = useTimer(isLoading);
  const { isExtracting, extractInfoFromDescription } = useJobExtraction(formData, setFormData);

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
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.description) {
      toast({
        title: "Manglende information",
        description: "Udfyld venligst som minimum jobtitel, virksomhed og beskrivelse",
        variant: "destructive",
      });
      return;
    }

    resetTimer();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UrlField 
        value={formData.url} 
        onChange={handleChange} 
        disabled={isLoading} 
      />

      <div className="space-y-4">
        <JobDescriptionField 
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          onExtract={extractInfoFromDescription}
          isExtracting={isExtracting}
        />

        <JobInfoFields 
          title={formData.title}
          company={formData.company}
          contactPerson={formData.contact_person}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <SubmitButton 
        isLoading={isLoading} 
        elapsedTime={formattedTime} 
      />
    </form>
  );
};

export default JobPostingForm;
