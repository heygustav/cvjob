
import { useToast } from '@/hooks/use-toast';

export const useDownloadErrorHandler = () => {
  const { toast } = useToast();

  const handleDownloadError = (error: any, format: string) => {
    console.error(`Error downloading ${format}:`, error);
    toast({
      title: `Download fejlede`,
      description: `Der opstod en fejl under download af ${format}. Prøv igen senere.`,
      variant: 'destructive',
    });
  };

  return { handleDownloadError };
};
