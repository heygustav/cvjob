
import { useCallback } from "react";
import { useDocumentDownload } from "@/hooks/shared/useDocumentDownload";

interface UseDocxDownloadParams {
  company?: string;
  jobTitle?: string;
  formattedDate: string;
  userName?: string;
}

export const useDocxDownload = ({
  company,
  jobTitle,
  formattedDate,
  userName
}: UseDocxDownloadParams) => {
  const { downloadDocx } = useDocumentDownload({
    userName,
    jobTitle,
    companyName: company,
    formattedDate
  });

  return { handleDownloadDocx: downloadDocx };
};
