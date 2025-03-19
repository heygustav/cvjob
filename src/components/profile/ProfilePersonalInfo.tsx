
import React, { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import PersonalInfoFields from "./PersonalInfoFields";
import ExperienceField from "./ExperienceField";
import EducationField from "./EducationField";
import SkillsField from "./SkillsField";
import FormActions from "./FormActions";

export interface ProfilePersonalInfoProps {
  formData: PersonalInfoFormState;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setFormData: Dispatch<SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
  validationErrors?: Record<string, string>;
}

const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  setFormData, 
  isLoading,
  validationErrors = {}
}) => {
  console.log("ProfilePersonalInfo rendering with formData:", formData);
  console.log("isLoading state:", isLoading);
  console.log("Browser info:", navigator.userAgent);

  // Validate if form is ready to submit
  const isFormValid = React.useMemo(() => {
    return formData.name.trim() !== "" && 
      formData.email.trim() !== "" && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      Object.keys(validationErrors).length === 0;
  }, [formData.name, formData.email, validationErrors]);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Form submission handler triggered in ProfilePersonalInfo");
    console.log("Form action:", (e.currentTarget as HTMLFormElement).action);
    console.log("Form method:", (e.currentTarget as HTMLFormElement).method);
    e.preventDefault(); // Prevent default form submission behavior
    
    // Additional validation before submission
    if (!isFormValid) {
      console.log("Form validation prevented submission");
      return;
    }
    
    console.log("About to call handleSubmit with form data:", formData);
    try {
      // Monitor network activity - using browser-compatible approach
      console.log("Network monitoring: Starting form submission");
      console.log("Browser:", navigator.userAgent);
      
      // Safe network info logging that works across browsers
      const networkInfo = {
        onLine: navigator.onLine,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      };
      console.log("Network info:", JSON.stringify(networkInfo));
      
      await handleSubmit(e);
      console.log("Network monitoring: Form submission completed successfully");
    } catch (error) {
      console.error("Network monitoring: Form submission failed with error:", error);
      console.error("Browser context on error:", navigator.userAgent);
    }
  };

  // For cross-browser testing and performance optimization
  React.useEffect(() => {
    // Performance measurement for component mount
    const startTime = performance.now();
    
    console.log("ProfilePersonalInfo rendered in browser:", navigator.userAgent);
    console.log("Viewport dimensions:", window.innerWidth, "x", window.innerHeight);
    
    // Listen for media query changes for responsive testing
    const mediaQueryList = window.matchMedia("(max-width: 640px)");
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      console.log("Media query changed, is mobile:", e.matches);
    };
    
    try {
      // Modern browsers
      mediaQueryList.addEventListener("change", handleMediaQueryChange);
    } catch (e) {
      // Older browsers
      try {
        // @ts-ignore - For older browsers
        mediaQueryList.addListener(handleMediaQueryChange);
      } catch (e2) {
        console.error("Browser does not support media query listeners");
      }
    }
    
    const mountTime = performance.now() - startTime;
    console.log(`ProfilePersonalInfo mount time: ${mountTime.toFixed(2)}ms`);
    
    return () => {
      try {
        mediaQueryList.removeEventListener("change", handleMediaQueryChange);
      } catch (e) {
        try {
          // @ts-ignore - For older browsers
          mediaQueryList.removeListener(handleMediaQueryChange);
        } catch (e2) {
          // Silent fail
        }
      }
    };
  }, []);

  return (
    <div className="space-y-6 p-8 text-left">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Personlige oplysninger</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Disse oplysninger bruges til at generere dine ansøgninger
        </p>
      </div>
      
      <form onSubmit={handleSave} className="space-y-6 text-left">
        <PersonalInfoFields 
          formData={formData} 
          handleChange={handleChange} 
          validationErrors={validationErrors} 
        />
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <ExperienceField 
            value={formData.experience} 
            onChange={handleChange} 
          />
          
          <EducationField 
            value={formData.education} 
            onChange={handleChange} 
          />
          
          <SkillsField 
            value={formData.skills} 
            onChange={handleChange} 
          />
        </div>

        <FormActions isLoading={isLoading} isFormValid={isFormValid} />
      </form>
    </div>
  );
};

export default ProfilePersonalInfo;
