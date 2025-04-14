
import React from "react";
import CompanyInputField from "./CompanyInputField";
import CompanyTextareaField from "./CompanyTextareaField";

interface CompanyBasicInfoProps {
  formData: {
    name: string;
    website: string;
    description: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

const CompanyBasicInfo = React.memo(({ 
  formData, 
  onChange, 
  isLoading 
}: CompanyBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <CompanyInputField
        id="name"
        label="Virksomhedsnavn"
        value={formData.name}
        onChange={onChange}
        placeholder="F.eks. ACME A/S"
        required
        isLoading={isLoading}
      />

      <CompanyInputField
        id="website"
        label="Hjemmeside"
        value={formData.website}
        onChange={onChange}
        placeholder="https://example.com"
        type="url"
        isLoading={isLoading}
      />

      <CompanyTextareaField
        id="description"
        label="Beskrivelse"
        value={formData.description}
        onChange={onChange}
        placeholder="Kort beskrivelse af virksomheden..."
        isLoading={isLoading}
      />
    </div>
  );
});

CompanyBasicInfo.displayName = "CompanyBasicInfo";

export default CompanyBasicInfo;
