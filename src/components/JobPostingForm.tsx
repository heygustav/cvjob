
import React from "react";
import { useJobForm } from "./job-form/useJobForm";
import { JobFormData } from "@/services/coverLetter/types";
import { useJobExtraction } from "./job-form/useJobExtraction";
import JobInfoFields from "./job-form/JobInfoFields";
import JobDescriptionField from "./job-form/JobDescriptionField";
import UrlField from "./job-form/UrlField";
import FormActions from "./job-form/FormActions";
import { JobPosting } from "@/lib/types";

interface JobPostingFormProps {
  initialData?: JobPosting | JobFormData;
  onSubmit: (data: JobFormData) => void;
  onSave?: (data: JobFormData) => Promise<void>;
  isLoading?: boolean;
  onKeywordClick?: (keyword: string) => void;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({
  initialData,
  onSubmit,
  onSave,
  isLoading = false,
  onKeywordClick
}) => {
  const {
    formData,
    errors,
    isSaving,
    handleChange,
    handleSubmit,
    handleSave,
  } = useJobForm({
    initialData: initialData as JobPosting,
    onSubmit,
    onSave,
  });

  const { isExtracting, extractInfoFromDescription } = useJobExtraction(formData, (extractedData) => {
    // Update form data with extracted information
    Object.entries(extractedData).forEach(([key, value]) => {
      const input = document.getElementById(key) as HTMLInputElement | HTMLTextAreaElement;
      if (input) {
        input.value = value as string;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <JobInfoFields
        title={formData.title}
        company={formData.company}
        contactPerson={formData.contact_person}
        deadline={formData.deadline}
        errors={errors}
        onChange={handleChange}
        disabled={isLoading}
      />

      <JobDescriptionField
        value={formData.description}
        onChange={handleChange}
        disabled={isLoading}
        onExtract={extractInfoFromDescription}
        isExtracting={isExtracting}
        error={errors.description}
        onKeywordClick={onKeywordClick}
      />

      <UrlField
        value={formData.url}
        onChange={handleChange}
        disabled={isLoading}
      />

      <FormActions
        isLoading={isLoading}
        isSaving={isSaving}
        onSave={onSave ? handleSave : undefined}
      />
    </form>
  );
};

export default JobPostingForm;
