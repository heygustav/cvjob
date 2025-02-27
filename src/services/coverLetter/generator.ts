
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
  
  // Set up a timeout without AbortController
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      console.log("Generation timed out after 45 seconds");
      reject(new Error('Generering af ansøgningen tog for lang tid. Prøv igen senere.'));
    }, 45000);
  });
  
  try {
    console.log("Preparing to call edge function for letter generation");
    
    // Create the generation promise
    const generatePromise = new Promise<{ data: any, error: any }>(async (resolve, reject) => {
      try {
        console.log("Calling Supabase function with payload:", {
          title: jobInfo.title,
          company: jobInfo.company,
          description: jobInfo.description?.substring(0, 50) + '...'
        });
        
        const result = await supabase.functions.invoke(
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
              locale: navigator.language,
              model: "gpt-4o"
            }
          }
        );
        console.log("Edge function call completed", result);
        resolve(result);
      } catch (error) {
        console.error("Error in invoke call:", error);
        reject(error);
      }
    });

    // Race between generation and timeout
    const result = await Promise.race([generatePromise, timeoutPromise]);
    
    // Clear the timeout since we got a response
    clearTimeout(timeoutId!);
    
    // Destructure the result
    const { data, error } = result as { data: any, error: any };

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Cover letter generation failed: ${error.message || "Unknown error"}`);
    }

    console.log("Response received from edge function:", data);

    if (!data || !data.content) {
      console.error("No content received from edge function:", data);
      throw new Error("Intet indhold modtaget fra serveren");
    }

    console.log("Successfully received content from edge function, length:", data.content.length);
    return data.content;
    
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId!);
    
    // Handle timeout errors
    if (error instanceof Error && error.message.includes('tog for lang tid')) {
      throw new Error('Generering af ansøgningen tog for lang tid. Prøv igen senere.');
    }
    
    // Handle network errors
    if (!navigator.onLine || (error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('connection') || 
         error.message.includes('offline')))) {
      throw new Error('Der opstod en netværksfejl. Kontroller din forbindelse og prøv igen.');
    }
    
    // For other errors, re-throw with the original message if possible
    if (error instanceof Error) {
      // Include more details in the error
      console.error("Error details:", error.stack);
      throw new Error(`Fejl ved generering: ${error.message}`);
    } else {
      throw new Error("Der opstod en ukendt fejl ved generering af ansøgningen. Prøv igen senere.");
    }
  }
};
