
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface DeleteLetterDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  letterTitle?: string; // Add letterTitle prop
}

const DeleteLetterDialog: React.FC<DeleteLetterDialogProps> = ({
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
  letterTitle = "ansøgning" // Default value
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Slet {letterTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Er du sikker på, at du vil slette denne {letterTitle}? 
            Denne handling kan ikke fortrydes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Annuller
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <LoadingSpinner className="mr-2" />
                Sletter...
              </>
            ) : (
              "Slet"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLetterDialog;
