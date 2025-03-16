
import { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

export const useUrlParams = (existingLetterId?: string) => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Handle job ID from URL
  useEffect(() => {
    if (jobId && !existingLetterId) {
      navigate(`/generator?jobId=${jobId}`);
    }
  }, [jobId, existingLetterId, navigate]);

  return {
    jobId,
    searchParams
  };
};
