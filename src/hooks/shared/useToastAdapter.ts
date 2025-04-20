
import { useToast } from '@/hooks/use-toast';

// This is a wrapper around useToast to provide a consistent interface
export const useToastAdapter = () => {
  const { toast } = useToast();
  
  return {
    toast
  };
};
