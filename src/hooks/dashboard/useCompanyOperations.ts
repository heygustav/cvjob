
import { useState } from "react";
import { Company } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for company operations (delete)
 */
export const useCompanyOperations = (
  initialCompanies: Company[],
  userId?: string
) => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const { toast } = useToast();

  const deleteCompany = async (id: string) => {
    if (!userId) return;
    
    try {
      // Check if the company exists and belongs to the user
      const { data: companyData, error: companyError } = await (supabase as any)
        .from('companies')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
        
      if (companyError) throw companyError;
      if (!companyData) throw new Error('Company not found');
      
      // Delete the company
      const { error: deleteError } = await (supabase as any)
        .from('companies')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
        
      if (deleteError) throw deleteError;
      
      // Update local state to remove the deleted company
      setCompanies(currentCompanies => 
        currentCompanies.filter(company => company.id !== id)
      );

      toast({
        title: "Virksomhed slettet",
        description: "Virksomheden er blevet slettet.",
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      
      toast({
        title: "Fejl ved sletning",
        description: "Der opstod en fejl under sletning af virksomheden.",
        variant: "destructive",
      });
    }
  };

  return {
    deleteCompany,
    companies
  };
};
