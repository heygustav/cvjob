
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
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

interface DeleteAccountProps {
  userId: string | undefined;
  onAccountDeleted: () => Promise<void>;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ userId, onAccountDeleted }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // First delete the profile data
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      // Then delete the user account
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userId as string
      );

      if (authError) throw authError;

      await onAccountDeleted();

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
    <div className="flex justify-between items-start py-3">
      <div className="flex items-start">
        <Trash2 className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
        <div className="text-left">
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
  );
};

export default DeleteAccount;
