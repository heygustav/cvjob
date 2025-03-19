
import { PersonalInfoFormState } from "@/pages/Profile";

// Define ProfileState without self-reference
export interface ProfileState {
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  education: string;
  skills: string;
  summary: string;
  photo?: string;
  has_completed_onboarding?: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface UseProfileDataReturn {
  formData: ProfileState;
  setFormData: React.Dispatch<React.SetStateAction<ProfileState>>;
  isLoading: boolean;
  isProfileLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  validationErrors: ValidationErrors;
  refreshProfile: () => Promise<void>;
}
