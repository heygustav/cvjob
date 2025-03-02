
import { supabase } from "@/integrations/supabase/client";
import { JobPosting } from "@/lib/types";
import { JobFormData } from "./types";

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

export const saveOrUpdateJob = async (
  jobData: JobFormData, 
  userId: string, 
  existingJobId?: string
): Promise<string> => {
  // Process deadline - convert empty string to null
  const deadlineValue = jobData.deadline && jobData.deadline.trim() !== '' 
    ? jobData.deadline 
    : null;
  
  if (existingJobId) {
    console.log("Updating existing job:", existingJobId);
    console.log("Job data to update:", jobData);
    
    const { error } = await supabase
      .from("job_postings")
      .update({
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        contact_person: jobData.contact_person,
        url: jobData.url,
        deadline: deadlineValue,
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
  console.log("Using deadline value:", deadlineValue);
  
  const { data, error } = await supabase
    .from("job_postings")
    .insert({
      user_id: userId,
      title: jobData.title || "",
      company: jobData.company || "",
      description: jobData.description || "",
      contact_person: jobData.contact_person,
      url: jobData.url,
      deadline: deadlineValue
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
