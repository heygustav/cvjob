
import { supabase } from "@/integrations/supabase/client";
import { JobPosting, CoverLetter, User } from "@/lib/types";
import { JobFormData, UserProfile } from "./types";

export const fetchJobById = async (id: string) => {
  console.log("Fetching job with ID:", id);
  
  const { data: job, error: jobError } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (jobError) {
    console.error("Error fetching job:", jobError);
    throw jobError;
  }

  if (!job) {
    console.log("No job found with ID:", id);
    return null;
  }

  return job as JobPosting;
};

export const fetchLettersForJob = async (jobId: string) => {
  console.log("Fetching letters for job:", jobId);
  
  const { data: letters, error: letterError } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("job_posting_id", jobId);

  if (letterError) {
    console.error("Error fetching letters:", letterError);
    throw letterError;
  }

  return letters as CoverLetter[];
};

export const fetchLetterById = async (id: string) => {
  console.log("Fetching letter with ID:", id);
  
  const { data: letter, error: letterError } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (letterError) {
    console.error("Error fetching letter:", letterError);
    throw letterError;
  }

  if (!letter) {
    console.log("No letter found with ID:", id);
    return null;
  }

  return letter as CoverLetter;
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  console.log("Fetching user profile data for user:", userId);
  
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error fetching profile:", profileError);
  }

  if (!profile) {
    return {
      name: "",
      email: "",
      phone: "",
      address: "",
      experience: "",
      education: "",
      skills: ""
    };
  }

  return profile as UserProfile;
};

export const saveOrUpdateJob = async (
  jobData: JobFormData, 
  userId: string, 
  existingJobId?: string
): Promise<string> => {
  if (existingJobId) {
    console.log("Updating existing job:", existingJobId);
    const { error } = await supabase
      .from("job_postings")
      .update({
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        contact_person: jobData.contact_person,
        url: jobData.url,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingJobId);

    if (error) {
      console.error("Error updating job:", error);
      throw new Error(`Fejl ved opdatering af job: ${error.message}`);
    }
    
    console.log("Successfully updated job", existingJobId);
    return existingJobId;
  } 
  
  console.log("Creating new job for user:", userId);
  const { data, error } = await supabase
    .from("job_postings")
    .insert({
      user_id: userId,
      title: jobData.title || "",
      company: jobData.company || "",
      description: jobData.description || "",
      contact_person: jobData.contact_person,
      url: jobData.url
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating job:", error);
    throw new Error(`Fejl ved oprettelse af job: ${error.message}`);
  }
  
  if (!data) {
    console.error("No job data returned");
    throw new Error("Intet job-id returneret fra serveren");
  }
  
  console.log("Successfully created job", data.id);
  return data.id;
};

export const saveCoverLetter = async (
  userId: string,
  jobId: string,
  content: string
): Promise<CoverLetter> => {
  console.log("Saving letter to database");
  
  const { data: letter, error: letterError } = await supabase
    .from("cover_letters")
    .insert({
      user_id: userId,
      job_posting_id: jobId,
      content: content
    })
    .select()
    .single();

  if (letterError) {
    console.error("Error saving letter:", letterError);
    throw new Error(`Fejl ved gem af ansøgning: ${letterError.message}`);
  }

  console.log("Letter saved successfully:", letter);
  return letter as CoverLetter;
};

export const updateLetterContent = async (
  letterId: string, 
  updatedContent: string
): Promise<void> => {
  console.log("Updating letter content:", letterId);
  
  const { error } = await supabase
    .from("cover_letters")
    .update({
      content: updatedContent,
      updated_at: new Date().toISOString()
    })
    .eq("id", letterId);

  if (error) {
    console.error("Error updating letter content:", error);
    throw error;
  }
  
  console.log("Letter content updated successfully");
};
