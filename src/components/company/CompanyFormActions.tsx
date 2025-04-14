
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CompanyFormActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onCancel: () => void;
}

const CompanyFormActions = React.memo(({ 
  isEditing, 
  isSaving, 
  onCancel 
}: CompanyFormActionsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSaving}
      >
        Annuller
      </Button>
      
      <Button
        type="submit"
        disabled={isSaving}
        className="bg-primary hover:bg-primary-700"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Gemmer...
          </>
        ) : isEditing ? (
          "Opdater virksomhed"
        ) : (
          "Opret virksomhed"
        )}
      </Button>
    </div>
  );
});

CompanyFormActions.displayName = "CompanyFormActions";

export default CompanyFormActions;
