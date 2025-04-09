
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates brainstorm ideas for the given keywords using the AI service
 * @param keywords The keywords to generate ideas for
 * @returns Array of idea strings
 */
export const generateBrainstormIdeas = async (keywords: string): Promise<string[]> => {
  try {
    if (!keywords.trim()) {
      throw new Error("Ingen stikord angivet");
    }

    console.log("Generating brainstorm ideas for keywords:", keywords);
    
    // Create the payload for the edge function - reusing the cover letter endpoint
    const payload = {
      // Using the same structure as the cover letter API
      jobInfo: {
        title: "Brainstorm",
        company: "Kompetencebeskrivelser",
        description: `List fem konkrete idéer til, hvordan jeg kan beskrive ${keywords}. Returner punkter på dansk.`,
        contactPerson: "",
        url: "",
        deadline: "",
      },
      userInfo: {
        name: "Brainstorm User",
        email: "",
        phone: "",
        address: "",
        education: "",
        experience: "",
        skills: keywords,
      },
      locale: "da-DK"
    };
    
    console.log("Sending payload to edge function");
    
    // Call the same edge function as the cover letter generator but with a different prompt
    const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
      body: payload
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Fejl ved generering af idéer: ${error.message || "Ukendt fejl"}`);
    }
    
    if (!data) {
      console.error("No data returned from edge function");
      throw new Error("Ingen data modtaget fra serveren. Prøv igen senere.");
    }
    
    if (!data.content) {
      console.error("No content returned from edge function");
      throw new Error("Ingen idéer blev genereret. Prøv igen.");
    }
    
    // Parse the text content into an array of ideas
    const ideas = data.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•\-*]\s*/, '').trim()) // Remove bullet points if present
      .filter(line => line.length > 0);
    
    if (ideas.length === 0) {
      throw new Error("Kunne ikke finde idéer i AI-svaret. Prøv igen.");
    }
    
    console.log(`Generated ${ideas.length} ideas`);
    return ideas;
  } catch (error) {
    console.error("Error in generateBrainstormIdeas:", error);
    
    let message = error instanceof Error ? 
      error.message : 
      "Der opstod en fejl ved generering af idéer. Prøv igen senere.";
    
    // Check for network or timeout issues
    if (error instanceof Error) {
      if (error.message.includes("network") || error.message.includes("timeout") || error.message.includes("fetch")) {
        message = "Kunne ikke forbinde til serveren. Tjek din internetforbindelse og prøv igen.";
      } else if (error.message.includes("api key") || error.message.includes("API key")) {
        message = "Der er et problem med adgangen til AI-tjenesten. Kontakt venligst support.";
      }
    }
    
    throw new Error(message);
  }
};
