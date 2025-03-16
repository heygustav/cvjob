
import { useState, useEffect } from "react";
import { User } from "@/lib/types";

export const useCompleteUser = (authUser: any): User | null => {
  const [completeUser, setCompleteUser] = useState<User | null>(null);
  
  // Create a complete user object from auth user
  useEffect(() => {
    if (authUser) {
      const user: User = {
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.name || "",
        profileComplete: false
      };
      
      setCompleteUser(user);
    } else {
      setCompleteUser(null);
    }
  }, [authUser]);
  
  return completeUser;
};
