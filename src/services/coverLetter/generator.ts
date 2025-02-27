
import { supabase } from "@/integrations/supabase/client";
import { JobFormData, UserProfile } from "./types";

export const generateCoverLetter = async (
  jobInfo: JobFormData,
  userInfo: UserProfile
): Promise<string> => {
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
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          address: userInfo.address,
          experience: userInfo.experience,
          education: userInfo.education,
          skills: userInfo.skills,
        }
      }
    }
  );

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(`Edge function fejl: ${error.message}`);
  }

  if (!data || !data.content) {
    console.error("No content received from edge function");
    throw new Error("Intet indhold modtaget fra serveren");
  }

  console.log("Successfully received content from edge function");
  return data.content;
};
