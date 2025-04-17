
import { useCallback } from "react";
import { useDocumentDownload } from "@/hooks/shared/useDocumentDownload";

interface UseTxtDownloadParams {
  company?: string;
  jobTitle?: string;
  formattedDate: string;
  userName?: string;
}

export const useTxtDownload = ({
  company,
  jobTitle,
  formattedDate,
  userName
}: UseTxtDownloadParams) => {
  const { downloadTxt } = useDocumentDownload({
    userName,
    jobTitle,
    companyName: company,
    formattedDate
  });

  return { handleDownloadTxt: downloadTxt };
};
