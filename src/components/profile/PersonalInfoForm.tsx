
import React from "react";
import { Save } from "lucide-react";
import { PersonalInfoFormState } from "@/pages/Profile";
import ResumeUploader from "./ResumeUploader";

interface PersonalInfoFormProps {
  formData: PersonalInfoFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setFormData: React.Dispatch<React.SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isLoading,
}) => {
  const handleExtractedData = (extractedData: Partial<PersonalInfoFormState>) => {
    setFormData(prev => ({
      ...prev,
      ...extractedData
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ResumeUploader onExtractedData={handleExtractedData} />
      
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
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            E-mailadresse
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
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
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700"
          >
            Erhvervserfaring
          </label>
          <div className="mt-1">
            <textarea
              id="experience"
              name="experience"
              rows={4}
              value={formData.experience}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Beskriv din erhvervserfaring..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Inkluder dine jobtitler, virksomheder du har arbejdet for og hovedansvarsområder.
          </p>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="education"
            className="block text-sm font-medium text-gray-700"
          >
            Uddannelse
          </label>
          <div className="mt-1">
            <textarea
              id="education"
              name="education"
              rows={3}
              value={formData.education}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Beskriv din uddannelsesmæssige baggrund..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Angiv dine uddannelser, institutioner og dimissionsår.
          </p>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700"
          >
            Kompetencer & kvalifikationer
          </label>
          <div className="mt-1">
            <textarea
              id="skills"
              name="skills"
              rows={3}
              value={formData.skills}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Angiv dine relevante kompetencer og kvalifikationer..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Inkluder tekniske kompetencer, certificeringer, sprog og andre relevante kvalifikationer.
          </p>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Gemmer...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Gem profil
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
