
import React from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Navn <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
              data-testid="profile-name-input"
              aria-required="true"
            />
          </FormControl>
        </div>
      </div>

      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <FormControl>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
              data-testid="profile-email-input"
              aria-required="true"
            />
          </FormControl>
        </div>
      </div>

      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefon
          </Label>
          <FormControl>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full"
              data-testid="profile-phone-input"
            />
          </FormControl>
        </div>
      </div>

      <div className="sm:col-span-3">
        <div className="form-group">
          <Label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adresse
          </Label>
          <FormControl>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full"
              data-testid="profile-address-input"
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
