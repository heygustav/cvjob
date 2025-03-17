
import { supabase } from "@/integrations/supabase/client";
import { JobFormData } from "./types";
import { User } from "@/lib/types";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  experience?: string;
  skills?: string;
}

export const generateCoverLetter = async (jobData: JobFormData, userInfo: UserProfile): Promise<string> => {
  console.log(`Starting cover letter generation with job info:`, {
    title: jobData.title,
    company: jobData.company,
    contactPerson: jobData.contact_person
  });

  console.log(`User profile for generation:`, {
    hasName: !!userInfo.name,
    hasEmail: !!userInfo.email,
    hasExperience: !!userInfo.experience,
    hasEducation: !!userInfo.education,
    hasSkills: !!userInfo.skills
  });

  try {
    console.log("Preparing to call edge function for letter generation");
    
    // Ensure we have data for required fields
    if (!jobData.title) {
      jobData.title = "Unavailable Position";
    }
    
    if (!jobData.company) {
      jobData.company = "Unavailable Company";
    }
    
    if (!jobData.description) {
      jobData.description = "No job description provided";
    }
    
    // Create the payload for the edge function
    const payload = {
      jobInfo: {
        title: jobData.title,
        company: jobData.company,
        description: jobData.description || "",
        contactPerson: jobData.contact_person || "Hiring Manager",
        url: jobData.url || "",
        deadline: jobData.deadline || "",
      },
      userInfo: {
        name: userInfo.name || "Job Seeker",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
        education: userInfo.education || "",
        experience: userInfo.experience || "",
        skills: userInfo.skills || "",
      },
      locale: "da-DK"
    };
    
    // Call the edge function to generate the cover letter
    const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
      body: payload
    });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error("Fejl ved generering af ansøgning. Prøv igen senere.");
    }
    
    if (!data || !data.content) {
      console.error("No content returned from edge function:", data);
      throw new Error("Ingen ansøgning blev genereret. Prøv igen.");
    }
    
    console.log("Letter generation successful, received content length:", data.content.length);
    return data.content;
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    
    // Create a more user-friendly error message
    const message = error instanceof Error ? 
      error.message : 
      "Der opstod en fejl ved generering af ansøgningen. Prøv igen senere.";
    
    throw new Error(message);
  }
};
