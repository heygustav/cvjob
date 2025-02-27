
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
  
  try {
    console.log("Calling edge function for letter generation");
    
    // Use a timeout promise instead of AbortController
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Generering af ansøgningen tog for lang tid. Prøv igen senere.'));
      }, 45000); // 45 seconds timeout
      
      // Store the timeout ID in a global scope for cleanup in case of component unmount
      (window as any).__generationTimeoutId = timeoutId;
    });
    
    // Create the actual API call promise
    const apiCallPromise = (async () => {
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
          }
        }
      );

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
      
      // Clear the timeout when successful
      if ((window as any).__generationTimeoutId) {
        clearTimeout((window as any).__generationTimeoutId);
        (window as any).__generationTimeoutId = null;
      }
      
      return data.content;
    })();
    
    // Race between the API call and the timeout
    return await Promise.race([apiCallPromise, timeoutPromise]);
    
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    
    // Clean up any timeout if it exists
    if ((window as any).__generationTimeoutId) {
      clearTimeout((window as any).__generationTimeoutId);
      (window as any).__generationTimeoutId = null;
    }
    
    // If the error is a timeout error, provide a specific message
    if (error instanceof Error && error.message.includes('tog for lang tid')) {
      throw new Error('Generering af ansøgningen tog for lang tid. Prøv igen senere.');
    }
    
    // For other errors, re-throw with the original message if possible
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Der opstod en fejl ved generering af ansøgningen. Prøv igen senere.");
    }
  }
};
