
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PasswordSettings from "./PasswordSettings";
import EmailPreferences, { EmailPreferences as EmailPreferencesType } from "./EmailPreferences";
import DeleteAccount from "./DeleteAccount";

const AccountSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState<EmailPreferencesType>({
    jobAlerts: true,
    newsletters: true,
    accountUpdates: true
  });

  // Fetch email preferences when component mounts
  useEffect(() => {
    if (user) {
      fetchEmailPreferences();
    }
  }, [user]);

  const fetchEmailPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_preferences")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data && data.email_preferences) {
        // Safely cast and validate the email preferences
        const preferences = data.email_preferences as any;
        
        // Create a validated preferences object with fallbacks
        const validatedPreferences: EmailPreferencesType = {
          jobAlerts: typeof preferences.jobAlerts === 'boolean' ? preferences.jobAlerts : true,
          newsletters: typeof preferences.newsletters === 'boolean' ? preferences.newsletters : true,
          accountUpdates: typeof preferences.accountUpdates === 'boolean' ? preferences.accountUpdates : true
        };
        
        setEmailNotifications(validatedPreferences);
      }
    } catch (error) {
      console.error("Error fetching email preferences:", error);
    }
  };

  return (
    <div className="space-y-4">
      <PasswordSettings userId={user?.id} />
      
      <EmailPreferences 
        userId={user?.id} 
        initialPreferences={emailNotifications}
        onPreferencesUpdated={fetchEmailPreferences}
      />
      
      <DeleteAccount 
        userId={user?.id} 
        onAccountDeleted={signOut}
      />
    </div>
  );
};

export default AccountSettings;
