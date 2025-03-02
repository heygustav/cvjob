
import React, { useState } from "react";
import { KeyRound } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordSettingsProps {
  userId: string | undefined;
}

const PasswordSettings: React.FC<PasswordSettingsProps> = ({ userId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

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

  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-200">
      <div className="flex items-start">
        <KeyRound className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
        <div className="text-left">
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
  );
};

export default PasswordSettings;
