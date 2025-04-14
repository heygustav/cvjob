
import React from "react";
import CompanyBasicInfo from "./form-fields/CompanyBasicInfo";
import CompanyContactInfo from "./form-fields/CompanyContactInfo";

interface CompanyFormFieldsProps {
  formData: {
    name: string;
    description: string;
    website: string;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

const CompanyFormFields = React.memo(({ 
  formData, 
  onChange, 
  isLoading 
}: CompanyFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <CompanyBasicInfo
        formData={formData}
        onChange={onChange}
        isLoading={isLoading}
      />
      
      <CompanyContactInfo
        formData={formData}
        onChange={onChange}
        isLoading={isLoading}
      />
    </div>
  );
});

CompanyFormFields.displayName = "CompanyFormFields";

export default CompanyFormFields;
