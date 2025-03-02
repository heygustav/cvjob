
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Define the type structure for email preferences
export interface EmailPreferences {
  jobAlerts: boolean;
  newsletters: boolean;
  accountUpdates: boolean;
}

interface EmailPreferencesProps {
  userId: string | undefined;
  initialPreferences: EmailPreferences;
  onPreferencesUpdated: () => void;
}

const EmailPreferences: React.FC<EmailPreferencesProps> = ({ 
  userId, 
  initialPreferences,
  onPreferencesUpdated
}) => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState<EmailPreferences>(initialPreferences);

  const handleEmailPreferencesUpdate = async () => {
    try {
      // Convert EmailPreferences to a plain object that can be stored as JSON
      const jsonPreferences = {
        jobAlerts: emailNotifications.jobAlerts,
        newsletters: emailNotifications.newsletters,
        accountUpdates: emailNotifications.accountUpdates
      };

      // Update using the converted object
      const { error } = await supabase
        .from("profiles")
        .update({
          email_preferences: jsonPreferences
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Præferencer opdateret",
        description: "Dine e-mailpræferencer er blevet gemt.",
      });
      
      onPreferencesUpdated();
    } catch (error) {
      console.error("Error updating email preferences:", error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af dine præferencer. Prøv venligst igen.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-200">
      <div className="flex items-start">
        <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-900">E-mailpræferencer</h3>
          <p className="text-sm text-gray-500 italic">Administrer dine e-mailpræferencer</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
            Administrer
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>E-mailpræferencer</DialogTitle>
            <DialogDescription>
              Vælg hvilke e-mails du ønsker at modtage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="jobAlerts"
                checked={emailNotifications.jobAlerts}
                onChange={(e) => setEmailNotifications(prev => ({
                  ...prev,
                  jobAlerts: e.target.checked
                }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="jobAlerts">Job notifikationer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newsletters"
                checked={emailNotifications.newsletters}
                onChange={(e) => setEmailNotifications(prev => ({
                  ...prev,
                  newsletters: e.target.checked
                }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="newsletters">Nyhedsbreve</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="accountUpdates"
                checked={emailNotifications.accountUpdates}
                onChange={(e) => setEmailNotifications(prev => ({
                  ...prev,
                  accountUpdates: e.target.checked
                }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="accountUpdates">Konto opdateringer</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEmailPreferencesUpdate}>
              Gem præferencer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailPreferences;
