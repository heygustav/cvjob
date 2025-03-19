
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobFormData } from "@/services/coverLetter/types";
import { JobPosting } from "@/lib/types";
import { z } from "zod";

// Define Zod schema for validation
const jobFormSchema = z.object({
  title: z.string().min(1, "Jobtitel er påkrævet"),
  company: z.string().min(1, "Virksomhedsnavn er påkrævet"),
  description: z.string().min(100, "Jobbeskrivelse skal være på mindst 100 tegn"),
  contact_person: z.string().optional(),
  url: z.string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "URL skal starte med http:// eller https://"
    ),
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
    deadline: initialData?.deadline ? initialData.deadline : "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Sanitize input - remove potentially dangerous HTML/script tags
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      // Use Zod to validate the form data
      jobFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod validation errors to our format
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Handle unexpected errors
        console.error("Validation error:", error);
        setErrors({ form: "Der opstod en uventet fejl ved validering" });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
    setFormData,
    errors,
    isSaving,
    handleChange,
    handleSubmit,
    handleSave
  };
};
