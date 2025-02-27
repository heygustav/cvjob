
import React, { useState } from "react";
import { KeyRound, Mail, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState({
    jobAlerts: true,
    newsletters: true,
    accountUpdates: true
  });

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast({
        title: "Fejl",
        description: "Indtast venligst en ny adgangskode",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Adgangskode opdateret",
        description: "Din adgangskode er blevet ændret.",
      });
      setNewPassword(""); // Clear the password field
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af adgangskoden. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPreferencesUpdate = async () => {
    try {
      // We need to handle this differently as email_preferences isn't in the type
      // We'll use a raw update query with JSON
      const { error } = await supabase.rpc('update_email_preferences', {
        user_id: user?.id,
        preferences: emailNotifications
      });

      if (error) throw error;

      toast({
        title: "Præferencer opdateret",
        description: "Dine e-mailpræferencer er blevet gemt.",
      });
    } catch (error) {
      console.error("Error updating email preferences:", error);
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af dine præferencer. Prøv venligst igen.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // First delete the profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user?.id);

      if (profileError) throw profileError;

      // Then delete the user account
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user?.id as string
      );

      if (authError) throw authError;

      await signOut();

      toast({
        title: "Konto slettet",
        description: "Din konto er blevet slettet permanent.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Fejl ved sletning",
        description: "Der opstod en fejl under sletning af din konto. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start py-3 border-b border-gray-200">
        <div className="flex items-start">
          <KeyRound className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Adgangskode</h3>
            <p className="text-sm text-gray-500 italic">Opdater din adgangskode</p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
              Ændre
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ændre adgangskode</DialogTitle>
              <DialogDescription>
                Indtast din nye adgangskode nedenfor.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Ny adgangskode</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Indtast ny adgangskode"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handlePasswordChange} disabled={isLoading}>
                {isLoading ? "Gemmer..." : "Gem adgangskode"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex justify-between items-start py-3 border-b border-gray-200">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">E-mailnotifikationer</h3>
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
              <DialogTitle>E-mailnotifikationer</DialogTitle>
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
      
      <div className="flex justify-between items-start py-3">
        <div className="flex items-start">
          <Trash2 className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Slet konto</h3>
            <p className="text-sm text-gray-500 italic">Slet permanent din konto og alle data</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              Slet
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Er du sikker på at du vil slette din konto?</AlertDialogTitle>
              <AlertDialogDescription>
                Denne handling kan ikke fortrydes. Din konto og alle tilhørende data vil blive slettet permanent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuller</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isLoading ? "Sletter..." : "Slet konto"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AccountSettings;
