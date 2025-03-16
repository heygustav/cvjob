
import { User } from "@/lib/types";

export const useCompleteUser = (authUser: any): User | null => {
  // Ensure user has all required properties by creating a complete User object
  if (!authUser) return null;
  
  return {
    id: authUser.id || "",
    email: authUser.email || "",
    name: authUser.user_metadata?.name || "",
    phone: authUser.user_metadata?.phone || "",
    address: authUser.user_metadata?.address || "",
    profileComplete: !!authUser.user_metadata?.profileComplete
  };
};
