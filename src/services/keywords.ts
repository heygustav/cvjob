
import { supabase } from "@/integrations/supabase/client";

/**
 * Extracts relevant Danish keywords from a job description
 * @param jobDescription The full job description text
 * @returns Array of extracted keywords
 */
export const getDanishKeywords = async (jobDescription: string): Promise<string[]> => {
  try {
    if (!jobDescription || jobDescription.trim().length < 50) {
      return [];
    }
    
    console.log("Extracting keywords from job description");
    
    // Create the payload for the edge function - reusing the cover letter endpoint
    const payload = {
      jobInfo: {
        title: "Keyword Extraction",
        company: "Nøgleord",
        description: `Gennemgå følgende jobbeskrivelse og udtræk de 5 vigtigste nøgleord eller kompetencer, som arbejdsgiveren efterspørger. Returner kun en liste med nøgleord på dansk, uden nummerering og forklaringer:\n\n${jobDescription}`,
        contactPerson: "",
        url: "",
        deadline: "",
      },
      userInfo: {
        name: "Keyword User",
        email: "",
        phone: "",
        address: "",
        education: "",
        experience: "",
        skills: "",
      },
      locale: "da-DK"
    };
    
    // Call the same edge function as the cover letter generator but with a different prompt
    const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
      body: payload
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Fejl ved udtræk af nøgleord: ${error.message || "Ukendt fejl"}`);
    }
    
    if (!data || !data.content) {
      return [];
    }
    
    // Parse the text content into an array of keywords
    const keywords = data.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•\-*]\s*/, '').trim()) // Remove bullet points if present
      .filter((keyword, index, self) => keyword.length > 0 && self.indexOf(keyword) === index); // Remove duplicates
    
    console.log(`Extracted ${keywords.length} keywords:`, keywords);
    return keywords.slice(0, 5); // Return top 5 keywords
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return [];
  }
};
