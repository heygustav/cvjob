
import { useToast } from "@/hooks/use-toast";
import { ToastVariant } from "@/hooks/coverLetter/types";

// Define ToastMessage type here since it's not exported from types.ts
export interface ToastMessage {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: React.ReactElement;
}

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
