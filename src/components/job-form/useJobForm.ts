
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { JobFormData } from "@/services/coverLetter/types";
import { JobPosting } from "@/lib/types";

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
    deadline: initialData?.deadline || "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
