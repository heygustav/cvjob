
import React, { useState } from "react";
import { Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { deleteUserAccount } from "@/services/coverLetter/userOperations";
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
import { Button } from "@/components/ui/button";

interface DeleteAccountProps {
  userId: string | undefined;
  onAccountDeleted: () => Promise<void>;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ userId, onAccountDeleted }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      await deleteUserAccount(userId);
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

  const handleDownloadData = async () => {
    if (!userId) return;
    
    setIsDownloading(true);
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Fetch user's cover letters
      const { data: letters, error: lettersError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", userId);
        
      if (lettersError) throw lettersError;
      
      // Fetch user's job listings
      const { data: jobs, error: jobsError } = await supabase
        .from("job_listings")
        .select("*")
        .eq("user_id", userId);
        
      if (jobsError) throw jobsError;
      
      // Compile all user data
      const userData = {
        profile,
        coverLetters: letters,
        jobListings: jobs,
        exportDate: new Date().toISOString(),
        dataRequestReason: "GDPR Data Subject Access Request"
      };
      
      // Create and download the JSON file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mine-persondata-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Data downloadet",
        description: "Dine personoplysninger er blevet downloadet som en JSON-fil.",
      });
    } catch (error) {
      console.error("Error downloading user data:", error);
      toast({
        title: "Fejl ved download",
        description: "Der opstod en fejl under download af dine data. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start py-3">
        <div className="flex items-start">
          <Download className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-900">Download dine data</h3>
            <p className="text-sm text-gray-500 italic">Download alle dine personoplysninger (GDPR)</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadData}
          disabled={isDownloading}
        >
          {isDownloading ? "Downloader..." : "Download data"}
        </Button>
      </div>
      
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
    </div>
  );
};

export default DeleteAccount;
