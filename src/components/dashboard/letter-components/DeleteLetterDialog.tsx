
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

interface DeleteLetterDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteLetterDialog: React.FC<DeleteLetterDialogProps> = ({
  isOpen,
  isDeleting,
  onConfirm,
  onCancel
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={() => !isDeleting && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
          <AlertDialogDescription>
            Denne handling kan ikke fortrydes. Dette vil permanent slette din
            ansøgning.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onCancel}>
            Annuller
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Sletter..." : "Slet"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLetterDialog;
