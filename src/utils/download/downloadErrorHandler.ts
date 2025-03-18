
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export const useDownloadErrorHandler = () => {
  const { toast } = useToast();

  const handleDownloadError = useCallback((error: any, format: string) => {
    console.error(`Error downloading ${format}:`, error);
    toast({
      title: `Download fejlede`,
      description: `Der opstod en fejl under download af ${format}. Prøv igen senere.`,
      variant: 'destructive',
    });
  }, [toast]);

  return { handleDownloadError };
};
