
import { User } from "@/lib/types";

export const useCompleteUser = (authUser: any): User | null => {
  // Early return if no user is provided
  if (!authUser) return null;
  
  // Check if user_metadata exists, and use it if available
  const metadata = authUser.user_metadata || {};
  
  // Create a complete User object with fallbacks for all properties
  return {
    id: authUser.id || "",
    email: authUser.email || "",
    name: metadata.name || authUser.user_metadata?.name || "",
    phone: metadata.phone || authUser.user_metadata?.phone || "",
    address: metadata.address || authUser.user_metadata?.address || "",
    profileComplete: !!(metadata.profileComplete || authUser.user_metadata?.profileComplete)
  };
};
