
import React from "react";
import { JobPosting } from "../lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import UrlField from "./job-form/UrlField";
import JobDescriptionField from "./job-form/JobDescriptionField";
import JobInfoFields from "./job-form/JobInfoFields";
import FormActions from "./job-form/FormActions";
import { useJobExtraction } from "./job-form/useJobExtraction";
import { useJobForm } from "./job-form/useJobForm";
import { useTimer } from "./job-form/useTimer";

interface JobPostingFormProps {
  onSubmit: (jobData: JobFormData) => void;
  onSave?: (jobData: JobFormData) => Promise<void>;
  initialData?: JobPosting;
  isLoading?: boolean;
  isSaving?: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  onSubmit,
  onSave,
  initialData,
  isLoading = false,
  isSaving = false,
}) => {
  const {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
    handleSave
  } = useJobForm({
    initialData,
    onSubmit,
    onSave,
  });
  
  const { isExtracting, extractInfoFromDescription } = useJobExtraction(formData, setFormData);
  const { formattedTime } = useTimer(isLoading);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <UrlField 
        value={formData.url} 
        onChange={handleChange} 
        disabled={isLoading} 
      />

      <div className="space-y-6">
        <JobDescriptionField 
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          onExtract={extractInfoFromDescription}
          isExtracting={isExtracting}
          error={errors.description}
        />

        <JobInfoFields 
          title={formData.title}
          company={formData.company}
          contactPerson={formData.contact_person}
          deadline={formData.deadline}
          onChange={handleChange}
          disabled={isLoading}
          errors={errors}
        />
      </div>

      <FormActions
        isLoading={isLoading}
        isSaving={isSaving}
        showSaveButton={!!onSave}
        onSave={handleSave}
        elapsedTime={formattedTime}
      />
    </form>
  );
};

export default JobPostingForm;
