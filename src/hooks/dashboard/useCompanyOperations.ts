
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
    if (!userId) {
      toast({
        title: "Fejl ved sletning",
        description: "Du skal være logget ind for at slette en virksomhed.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if the company exists and belongs to the user
      const { data: companyData, error: companyError } = await (supabase as any)
        .from('companies')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
        
      if (companyError) {
        // Create user-friendly error messages based on error code
        if (companyError.code === 'PGRST116') {
          throw new Error("Virksomheden blev ikke fundet");
        } else if (companyError.code === 'PGRST104') {
          throw new Error("Forespørgslen kunne ikke behandles. Prøv igen senere.");
        } else {
          throw companyError;
        }
      }
      
      if (!companyData) {
        throw new Error("Virksomheden findes ikke eller du har ikke adgang til den");
      }
      
      // Delete the company
      const { error: deleteError } = await (supabase as any)
        .from('companies')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
        
      if (deleteError) {
        // Handle specific delete errors
        if (deleteError.code === 'PGRST204') {
          throw new Error("Virksomheden kunne ikke slettes. Den bruges muligvis af andre data.");
        } else if (deleteError.code === 'P0001') {
          throw new Error("Virksomheden kunne ikke slettes pga. database restriktioner.");
        } else {
          throw deleteError;
        }
      }
      
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
      
      // Create a user-friendly error message
      let errorMessage = "Der opstod en fejl under sletning af virksomheden.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Handle network errors
      if (!navigator.onLine) {
        errorMessage = "Du er offline. Tjek din internetforbindelse og prøv igen.";
      }
      
      toast({
        title: "Fejl ved sletning",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    deleteCompany,
    companies
  };
};
