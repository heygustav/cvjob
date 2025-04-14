
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Company } from "@/lib/types";

interface CompanyFormState {
  name: string;
  description: string;
  website: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  notes: string;
}

export const useCompanyForm = (userId?: string, initialData?: Company) => {
  const [formData, setFormData] = useState<CompanyFormState>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    website: initialData?.website || "",
    contact_person: initialData?.contact_person || "",
    contact_email: initialData?.contact_email || "",
    contact_phone: initialData?.contact_phone || "",
    notes: initialData?.notes || "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Fejl",
        description: "Du skal være logget ind for at gemme virksomheder.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name.trim()) {
      toast({
        title: "Manglende information",
        description: "Virksomhedsnavn er påkrævet.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const companyData = {
        ...formData,
        user_id: userId,
        updated_at: new Date().toISOString(),
      };
      
      if (initialData?.id) {
        const { error } = await (supabase as any)
          .from('companies')
          .update(companyData)
          .eq('id', initialData.id)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        toast({
          title: "Succes",
          description: "Virksomheden blev opdateret.",
        });
      } else {
        const { error } = await (supabase as any)
          .from('companies')
          .insert({
            ...companyData,
            created_at: new Date().toISOString(),
          });
          
        if (error) throw error;
        
        toast({
          title: "Succes",
          description: "Virksomheden blev oprettet.",
        });
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Kunne ikke gemme virksomheden. Prøv igen senere.');
      toast({
        title: "Fejl",
        description: "Kunne ikke gemme virksomheden. Prøv igen senere.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, userId, initialData, supabase, navigate, toast]);

  return {
    formData,
    isLoading,
    isSaving,
    error,
    handleChange,
    handleSubmit
  };
};
