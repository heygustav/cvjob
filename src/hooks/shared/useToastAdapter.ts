
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/hooks/use-toast";

/**
 * A hook that adapts the ToastMessage type to the Toast type by mapping variants
 * to those supported by the UI toast component.
 */
export function useToastAdapter() {
  const { toast: originalToast } = useToast();
  
  const toast = (message: ToastMessage) => {
    const { variant, ...rest } = message;
    
    return originalToast({
      ...rest,
      variant: variant
    });
  };
  
  return { toast };
}
