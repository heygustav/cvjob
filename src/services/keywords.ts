
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";

/**
 * Extracts relevant Danish keywords from a job description
 * @param jobDescription The job description text
 * @returns Array of keywords extracted from the job description
 */
export const getDanishKeywords = async (jobDescription: string): Promise<string[]> => {
  try {
    // Sanitize input to prevent XSS
    const sanitizedDescription = DOMPurify.sanitize(jobDescription);
    
    // Validate input
    if (!sanitizedDescription || sanitizedDescription.length < 100) {
      console.warn("Job description too short for keyword extraction");
      return [];
    }

    // Call our Edge Function that uses AI to extract keywords
    const { data, error } = await supabase.functions.invoke('extract-job-info', {
      body: { 
        jobDescription: sanitizedDescription,
        model: "gpt-4o-mini", 
        temperature: 0.3,
        mode: "keywords"
      }
    });
    
    if (error) {
      console.error("Error extracting keywords:", error);
      return [];
    }
    
    if (!data || !Array.isArray(data.keywords)) {
      console.error("Invalid response format from keyword extraction");
      return [];
    }
    
    // Sanitize all keywords before returning
    const sanitizedKeywords = data.keywords
      .map((keyword: string) => DOMPurify.sanitize(keyword))
      .filter((keyword: string) => keyword.length > 0);
    
    return sanitizedKeywords;
  } catch (error) {
    console.error("Error in keyword extraction:", error);
    return [];
  }
};
