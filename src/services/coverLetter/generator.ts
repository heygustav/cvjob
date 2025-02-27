
import { supabase } from "@/integrations/supabase/client";
import { JobFormData, UserProfile } from "./types";

export const generateCoverLetter = async (
  jobInfo: JobFormData,
  userInfo: UserProfile
): Promise<string> => {
  console.log("Starting cover letter generation with job info:", {
    title: jobInfo.title,
    company: jobInfo.company,
    contactPerson: jobInfo.contact_person,
  });
  console.log("User profile for generation:", {
    hasName: !!userInfo.name,
    hasEmail: !!userInfo.email,
    hasExperience: !!userInfo.experience,
    hasEducation: !!userInfo.education,
    hasSkills: !!userInfo.skills,
  });
  
  // Create an AbortController for timeout management
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort('timeout');
    console.log("Generation timed out after 45 seconds");
  }, 45000);
  
  try {
    console.log("Calling edge function for letter generation");
    
    const { data, error } = await supabase.functions.invoke(
      'generate-cover-letter',
      {
        body: {
          jobInfo: {
            title: jobInfo.title,
            company: jobInfo.company,
            description: jobInfo.description,
            contactPerson: jobInfo.contact_person,
            url: jobInfo.url
          },
          userInfo: {
            name: userInfo.name || '',
            email: userInfo.email || '',
            phone: userInfo.phone || '',
            address: userInfo.address || '',
            experience: userInfo.experience || '',
            education: userInfo.education || '',
            skills: userInfo.skills || '',
          },
          locale: navigator.language, // Send user's locale for better date formatting
          model: "gpt-4" // Always use gpt-4 for cover letter generation
        },
        signal: controller.signal
      }
    );

    // Clear the timeout as we got a response
    clearTimeout(timeoutId);

    if (error) {
      console.error("Edge function error:", error);
      // Extract and use the original error message if possible
      const message = error.message || "Unknown error";
      throw new Error(`Cover letter generation failed: ${message}`);
    }

    // Log the response to see what's coming back
    console.log("Response from edge function:", data);

    if (!data || !data.content) {
      console.error("No content received from edge function:", data);
      throw new Error("Intet indhold modtaget fra serveren");
    }

    console.log("Successfully received content from edge function, length:", data.content.length);
    return data.content;
    
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
    
    // Handle AbortController errors specifically
    if (error.name === 'AbortError' || (error instanceof Error && error.message.includes('timeout'))) {
      throw new Error('Generering af ansøgningen tog for lang tid. Prøv igen senere.');
    }
    
    // Handle network errors
    if (!navigator.onLine || (error instanceof Error && error.message.includes('network'))) {
      throw new Error('Der opstod en netværksfejl. Kontroller din forbindelse og prøv igen.');
    }
    
    // For other errors, re-throw with the original message if possible
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Der opstod en fejl ved generering af ansøgningen. Prøv igen senere.");
    }
  }
};
