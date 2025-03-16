
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useUrlParams = (existingLetterId?: string) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Handle URL parameters
  useEffect(() => {
    const jobId = searchParams.get("jobId");
    const letterId = searchParams.get("letterId");
    const stepParam = searchParams.get("step");
    const isDirect = searchParams.get("direct") === "true";
    
    console.log("URL params:", { jobId, letterId, stepParam, isDirect });
    
    // Clean up redundant URL parameters if we're already handling them via props
    if (existingLetterId && letterId && existingLetterId === letterId) {
      // Remove the letterId from URL since it's already handled via props
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("letterId");
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [searchParams, navigate, existingLetterId]);
};
