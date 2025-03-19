import React from "react";
import FormSection from "./FormSection";
import PersonalInfoSummary from "./PersonalInfoSummary";

export interface PersonalInfoFieldsProps {
  formData: {
    name: string;
    phone: string;
    address: string;
    summary?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validationErrors: Record<string, string>;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  formData,
  handleChange,
  validationErrors
}) => {
  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <FormSection
          title="Personlige oplysninger"
          description="Opdater dine personlige oplysninger."
        >
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Fulde navn
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              {validationErrors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefonnummer
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              {validationErrors.phone && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <PersonalInfoSummary 
              value={formData.summary || ""}
              onChange={handleChange}
            />
          </div>
        </FormSection>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
