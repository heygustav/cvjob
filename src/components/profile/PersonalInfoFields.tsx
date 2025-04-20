
import React from "react";
import FormSection from "./FormSection";
import PersonalInfoSummary from "./PersonalInfoSummary";

export interface PersonalInfoFieldsProps {
  formData: {
    name: string;
    phone: string;
    address: string;
    summary?: string;
    email?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  validationErrors: Record<string, string>;
  validateField?: (name: string, value: any) => boolean;
  handleBlur?: (fieldName: string) => void;
  isFieldTouched?: (fieldName: string) => boolean;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  formData,
  handleChange,
  validationErrors,
  validateField,
  handleBlur,
  isFieldTouched
}) => {
  const showError = (fieldName: string) => {
    return isFieldTouched?.(fieldName) && validationErrors[fieldName];
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e);
    if (validateField) {
      validateField(e.target.name, e.target.value);
    }
  };

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
                  onChange={handleFieldChange}
                  onBlur={() => handleBlur?.("name")}
                  className={`block w-full rounded-md shadow-sm sm:text-sm
                    ${showError("name")
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-black focus:ring-black"
                    }`}
                />
              </div>
              {showError("name") && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Phone field */}
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
                  onChange={handleFieldChange}
                  onBlur={() => handleBlur?.("phone")}
                  className={`block w-full rounded-md shadow-sm sm:text-sm
                    ${showError("phone")
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-black focus:ring-black"
                    }`}
                />
              </div>
              {showError("phone") && (
                <p className="mt-2 text-sm text-red-600">
                  {validationErrors.phone}
                </p>
              )}
            </div>
            
            {/* Email field */}
            {formData.email !== undefined && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    onBlur={() => handleBlur?.("email")}
                    className={`block w-full rounded-md shadow-sm sm:text-sm
                      ${showError("email")
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-black focus:ring-black"
                      }`}
                  />
                </div>
                {showError("email") && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>
            )}

            {/* Address field */}
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
                  onChange={handleFieldChange}
                  onBlur={() => handleBlur?.("address")}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <PersonalInfoSummary 
              value={formData.summary || ""}
              onChange={handleFieldChange}
            />
          </div>
        </FormSection>
      </div>
    </div>
  );
};

export default React.memo(PersonalInfoFields);
