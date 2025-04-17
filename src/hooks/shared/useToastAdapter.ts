
import { useToast } from "@/hooks/use-toast";
import { ToastMessage } from "@/hooks/coverLetter/types";

/**
 * A hook that adapts the ToastMessage type to the Toast type by mapping variants
 * to those supported by the UI toast component.
 */
export function useToastAdapter() {
  const { toast: originalToast } = useToast();
  
  const toast = (message: ToastMessage) => {
    const { variant, ...rest } = message;
    // Map "success" variant to "default" since UI toast only supports "default" and "destructive"
    const mappedVariant = variant === "success" ? "default" : variant;
    
    return originalToast({
      ...rest,
      variant: mappedVariant
    });
  };
  
  return { toast };
}
