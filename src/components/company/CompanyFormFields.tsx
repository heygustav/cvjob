
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="space-y-4">
      {/* Company name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Virksomhedsnavn *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="F.eks. ACME A/S"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Beskrivelse
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Kort beskrivelse af virksomheden..."
          rows={3}
          disabled={isLoading}
          className="w-full resize-y"
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm font-medium">
          Hjemmeside
        </Label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={onChange}
          placeholder="https://example.com"
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {/* Contact details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_person" className="text-sm font-medium">
            Kontaktperson
          </Label>
          <Input
            id="contact_person"
            name="contact_person"
            value={formData.contact_person}
            onChange={onChange}
            placeholder="Navn på kontaktperson"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={onChange}
            placeholder="kontakt@example.com"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone" className="text-sm font-medium">
            Telefon
          </Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={onChange}
            placeholder="+45 12345678"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Noter
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={onChange}
            placeholder="Eventuelle noter om virksomheden..."
            rows={3}
            disabled={isLoading}
            className="w-full resize-y"
          />
        </div>
      </div>
    </div>
  );
});

CompanyFormFields.displayName = "CompanyFormFields";

export default CompanyFormFields;
