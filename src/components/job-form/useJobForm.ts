
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobFormData } from "@/services/coverLetter/types";
import { JobPosting } from "@/lib/types";
import { useFormValidation, commonSchemas } from '@/hooks/useFormValidation';
import { z } from 'zod';
import { sanitizeInput } from '@/utils/security';

const jobFormSchema = z.object({
  title: z.string().min(1, "Jobtitel er påkrævet"),
  company: z.string().min(1, "Virksomhedsnavn er påkrævet"),
  description: z.string().min(100, "Jobbeskrivelse skal være på mindst 100 tegn"),
  contact_person: z.string().optional(),
  url: commonSchemas.website,
  deadline: z.string().optional(),
});

interface UseJobFormProps {
  initialData?: JobPosting;
  onSubmit: (jobData: JobFormData) => void;
  onSave?: (jobData: JobFormData) => Promise<void>;
}

export const useJobForm = ({ initialData, onSubmit, onSave }: UseJobFormProps) => {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || "",
    company: initialData?.company || "",
    description: initialData?.description || "",
    contact_person: initialData?.contact_person || "",
    url: initialData?.url || "",
    deadline: "",
  });
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();
  
  const { validateForm, errors, clearFieldError } = useFormValidation<JobFormData>(jobFormSchema);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Sanitize input - remove potentially dangerous HTML/script tags
    const sanitizedValue = sanitizeInput(value);
    
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
    
    if (errors[name]) {
      clearFieldError(name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      toast({
        title: "Fejl i formular",
        description: "Udfyld venligst alle påkrævede felter korrekt.",
        variant: "destructive",
      });
      return;
    }

    try {
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
    
    if (!onSave) {
      toast({
        title: "Funktionen er ikke tilgængelig",
        description: "Gem som kladde er ikke tilgængelig.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      await onSave(formData);
      toast({
        title: "Gemt som kladde",
        description: "Dit job er blevet gemt som kladde til senere brug.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Fejl ved gem",
        description: "Der opstod en fejl ved at gemme jobbet som kladde.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    errors,
    isSaving,
    handleChange,
    handleSubmit,
    handleSave
  };
};
