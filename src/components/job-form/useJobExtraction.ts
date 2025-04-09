
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobFormData } from "@/services/coverLetter/types";
import DOMPurify from "dompurify";

export const useJobExtraction = (formData: JobFormData, setFormData: (data: JobFormData) => void) => {
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

    // Validate input length to prevent API abuse
    if (description.length > 10000) {
      toast({
        title: "Beskrivelse for lang",
        description: "Jobbeskrivelsen er for lang til at blive analyseret. Maksimum 10.000 tegn tilladt.",
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

      // Call our Edge Function that uses OpenAI with proper error handling
      const { data, error } = await supabase.functions.invoke('extract-job-info', {
        body: { 
          jobDescription: DOMPurify.sanitize(description), // Sanitize input
          model: "gpt-4o-mini", 
          temperature: 0.3,
          mode: "extract"
        }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        
        let errorMessage = "Fejl ved analyse af jobopslag";
        if (error.message.includes('non-2xx status code')) {
          errorMessage = "Serveren kunne ikke behandle anmodningen. Tjek at jobbeskrivelsen ikke er for lang.";
        } else if (error.message.includes('Failed to send')) {
          errorMessage = "Kunne ikke forbinde til analysetjenesten. Tjek din internetforbindelse.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Analysen tog for lang tid. Prøv igen senere eller med en kortere jobbeskrivelse.";
        } else {
          // Generic error without exposing implementation details
          errorMessage = "Der opstod en fejl ved behandling af jobopslaget. Prøv igen senere.";
        }
        
        throw new Error(errorMessage);
      }
      
      if (!data) {
        throw new Error("Ingen data modtaget fra AI-analyse");
      }
      
      console.log("Received extraction data:", data);
      
      // Sanitize all extracted data before using it
      const safeData = {
        title: data.title ? DOMPurify.sanitize(data.title) : "",
        company: data.company ? DOMPurify.sanitize(data.company) : "",
        contact_person: data.contact_person ? DOMPurify.sanitize(data.contact_person) : ""
      };
      
      // Update form with the sanitized extracted data
      const newFormData = { 
        ...formData,
        title: safeData.title || formData.title,
        company: safeData.company || formData.company,
        contact_person: safeData.contact_person || formData.contact_person,
      };
      
      setFormData(newFormData);
      
      // Show success toast with information about what was extracted
      const extractedFields = [];
      if (safeData.title && newFormData.title !== formData.title) extractedFields.push('jobtitel');
      if (safeData.company && newFormData.company !== formData.company) extractedFields.push('virksomhed');
      if (safeData.contact_person && newFormData.contact_person !== formData.contact_person) extractedFields.push('kontaktperson');
      
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
