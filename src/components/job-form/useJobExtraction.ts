
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobFormData } from "@/services/coverLetter/types";

export const useJobExtraction = (formData: JobFormData, setFormData: React.Dispatch<React.SetStateAction<JobFormData>>) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const extractInfoFromDescription = async () => {
    const description = formData.description;
    
    if (!description) {
      toast({
        title: "Ingen beskrivelse at analysere",
        description: "Indsæt venligst en jobbeskrivelse først",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    
    try {
      console.log("Calling OpenAI to extract job information");
      toast({
        title: "Analyserer jobopslag",
        description: "Vent venligst mens vi analyserer jobopslaget...",
      });

      // Call our Edge Function that uses OpenAI
      const { data, error } = await supabase.functions.invoke('extract-job-info', {
        body: { 
          jobDescription: description,
          // For extraction, we can use a different model than GPT-4
          model: "gpt-4o-mini", 
          temperature: 0.3
        }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(`Fejl ved analyse: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("Ingen data modtaget fra AI-analyse");
      }
      
      console.log("Received extraction data:", data);
      
      // Update form with the extracted data, NOT including URL
      const newFormData = { 
        ...formData,
        title: data.title || formData.title,
        company: data.company || formData.company,
        contact_person: data.contact_person || formData.contact_person,
      };
      
      setFormData(newFormData);
      
      // Show success toast with information about what was extracted
      const extractedFields = [];
      if (data.title && newFormData.title !== formData.title) extractedFields.push('jobtitel');
      if (data.company && newFormData.company !== formData.company) extractedFields.push('virksomhed');
      if (data.contact_person && newFormData.contact_person !== formData.contact_person) extractedFields.push('kontaktperson');
      
      if (extractedFields.length > 0) {
        toast({
          title: "Information fundet",
          description: `Vi har udtrukket følgende: ${extractedFields.join(', ')}`,
        });
      } else {
        toast({
          title: "Ingen ny information fundet",
          description: "Vi kunne ikke finde yderligere information i teksten. Prøv at udfylde felterne manuelt.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in extraction process:", error);
      toast({
        title: "Fejl ved udtrækning",
        description: error instanceof Error 
          ? error.message 
          : "Der opstod en fejl under forsøget på at udtrække information. Prøv at udfylde felterne manuelt.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    isExtracting,
    extractInfoFromDescription
  };
};
