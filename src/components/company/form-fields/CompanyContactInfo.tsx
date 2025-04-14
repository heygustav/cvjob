
import React from "react";
import CompanyInputField from "./CompanyInputField";
import CompanyTextareaField from "./CompanyTextareaField";

interface CompanyContactInfoProps {
  formData: {
    contact_person: string;
    contact_email: string;
    contact_phone: string;
    notes: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

const CompanyContactInfo = React.memo(({ 
  formData, 
  onChange, 
  isLoading 
}: CompanyContactInfoProps) => {
  return (
    <div className="space-y-4">
      <CompanyInputField
        id="contact_person"
        label="Kontaktperson"
        value={formData.contact_person}
        onChange={onChange}
        placeholder="Navn på kontaktperson"
        isLoading={isLoading}
      />

      <CompanyInputField
        id="contact_email"
        label="Email"
        value={formData.contact_email}
        onChange={onChange}
        placeholder="kontakt@example.com"
        type="email"
        isLoading={isLoading}
      />

      <CompanyInputField
        id="contact_phone"
        label="Telefon"
        value={formData.contact_phone}
        onChange={onChange}
        placeholder="+45 12345678"
        isLoading={isLoading}
      />

      <CompanyTextareaField
        id="notes"
        label="Noter"
        value={formData.notes}
        onChange={onChange}
        placeholder="Eventuelle noter om virksomheden..."
        isLoading={isLoading}
      />
    </div>
  );
});

CompanyContactInfo.displayName = "CompanyContactInfo";

export default CompanyContactInfo;
