
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
    console.log("Preparing to call edge function for letter generation");
    
    // Basic validation
    if (!jobInfo.title || !jobInfo.company || !jobInfo.description) {
      throw new Error('Manglende joboplysninger. Udfyld venligst alle påkrævede felter.');
    }
    
    // Call the edge function directly - no complex Promise racing
    console.log("Calling Supabase function with job info");
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
          locale: navigator.language,
          model: "gpt-4o",
          additionalInstructions: "Match the tone of the job ad without parroting the same words and sentences, except where necessary to explain technical qualifications or similar requirements. Create an authentic voice that resonates with the company culture while maintaining originality."
        }
      }
    );

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Fejl ved generering af ansøgning: ${error.message || "Ukendt fejl"}`);
    }

    if (!data || !data.content) {
      console.error("No content received from edge function:", data);
      throw new Error("Intet indhold modtaget fra serveren");
    }

    console.log("Successfully received content from edge function, length:", data.content.length);
    return data.content;
    
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    
    // Handle network errors
    if (!navigator.onLine || (error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('connection') || 
         error.message.includes('offline')))) {
      throw new Error('Der opstod en netværksfejl. Kontroller din forbindelse og prøv igen.');
    }
    
    // For other errors, re-throw with appropriate message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Der opstod en fejl ved generering af ansøgningen. Prøv igen senere.");
    }
  }
};
