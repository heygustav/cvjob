
import React from "react";
import { Building } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CompanyFormHeaderProps {
  isEditing: boolean;
}

const CompanyFormHeader = React.memo(({ isEditing }: CompanyFormHeaderProps) => {
  const pageTitle = isEditing ? "Rediger virksomhed" : "Tilføj ny virksomhed";
  
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold flex items-center gap-2">
        <Building className="h-6 w-6 text-primary" aria-hidden="true" />
        {pageTitle}
      </CardTitle>
      <CardDescription>
        {isEditing 
          ? "Rediger information om virksomheden" 
          : "Tilføj en ny virksomhed til dit dashboard"}
      </CardDescription>
    </CardHeader>
  );
});

CompanyFormHeader.displayName = "CompanyFormHeader";

export default CompanyFormHeader;
