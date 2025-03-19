
import React, { useState } from "react";
import { User } from "../lib/types";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface PersonalInfoFormProps {
  user: User;
  onSave: (data: PersonalInfoFormData) => void;
  isLoading?: boolean;
}

interface PersonalInfoFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    summary: user.summary || "", // Use the summary from user object
    experience: "",
    education: "",
    skills: "",
  });
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form submission in PersonalInfoForm component");
    console.log("Form action:", (e.target as HTMLFormElement).action);
    console.log("Form method:", (e.target as HTMLFormElement).method);
    
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please provide at least your name and email",
        variant: "destructive",
      });
      return;
    }
    
    // Log network activity
    console.log("Network monitoring: About to call onSave with form data");
    onSave(formData);
    console.log("Network monitoring: onSave called");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <div className="mt-1">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
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

        <div className="sm:col-span-6">
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700"
          >
            Short Resume/Summary
          </label>
          <div className="mt-1">
            <textarea
              id="summary"
              name="summary"
              rows={2}
              value={formData.summary}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="A brief summary about yourself..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            A short description that will appear under your name in the CV.
          </p>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700"
          >
            Work Experience
          </label>
          <div className="mt-1">
            <textarea
              id="experience"
              name="experience"
              rows={4}
              value={formData.experience}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="Describe your work experience..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Include your job titles, companies you've worked for, and key
            responsibilities.
          </p>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="education"
            className="block text-sm font-medium text-gray-700"
          >
            Education
          </label>
          <div className="mt-1">
            <textarea
              id="education"
              name="education"
              rows={3}
              value={formData.education}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="Describe your educational background..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            List your degrees, institutions, and graduation years.
          </p>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700"
          >
            Skills & Qualifications
          </label>
          <div className="mt-1">
            <textarea
              id="skills"
              name="skills"
              rows={3}
              value={formData.skills}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              placeholder="List your relevant skills and qualifications..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Include technical skills, certifications, languages, and
            other relevant qualifications.
          </p>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70"
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
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
