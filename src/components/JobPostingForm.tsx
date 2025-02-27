
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
import { supabase } from "@/integrations/supabase/client";
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

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Save button clicked", formData);
    
    if (!validateForm()) {
      console.log("Form validation failed for save", errors);
      toast({
        title: "Fejl i formular",
        description: "Udfyld venligst alle påkrævede felter korrekt.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      console.log("Starting save process");
      
      // If onSave is provided, use it
      if (onSave) {
        console.log("Using provided onSave function");
        await onSave(formData);
      } 
      // Otherwise do a direct save if we have a user
      else if (user) {
        console.log("Saving job for user", user.id);
        await saveOrUpdateJob(formData, user.id, initialData?.id);
      } else {
        console.log("No user found, cannot save");
        toast({
          title: "Log ind krævet",
          description: "Du skal være logget ind for at gemme et jobopslag.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      console.log("Save completed successfully");
      toast({
        title: "Jobopslag gemt",
        description: "Dit jobopslag er blevet gemt. Du kan generere en ansøgning senere.",
      });
      
      // Always navigate to dashboard after saving
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving job posting:", error);
      toast({
        title: "Fejl ved gem",
        description: "Der opstod en fejl under gem af jobopslaget.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Gem jobopslag til senere"
        >
          {isSaving ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2" />
              Gemmer...
            </span>
          ) : (
            "Gem til senere"
          )}
        </button>
        
        <SubmitButton 
          isLoading={isLoading} 
          elapsedTime={formattedTime}
          className="flex-1"
        />
      </div>
    </form>
  );
};

export default JobPostingForm;
