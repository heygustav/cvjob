
import { JobFormData } from "@/services/coverLetter/types";
import { User } from "@/lib/types";

export const handleLetterGeneration = async (
  jobData: JobFormData,
  user: User | null
) => {
  // Mock implementation for now
  const result = {
    job: {
      ...jobData,
      id: jobData.id || Math.random().toString(),
      user_id: user?.id || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    letter: {
      id: Math.random().toString(),
      user_id: user?.id || "",
      job_posting_id: jobData.id || Math.random().toString(),
      content: `Sample cover letter for ${jobData.title} at ${jobData.company}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  return result;
};
