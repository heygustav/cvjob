
import React, { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { PersonalInfoFormState } from "@/pages/Profile";

export interface ProfilePersonalInfoProps {
  formData: PersonalInfoFormState;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  setFormData: Dispatch<SetStateAction<PersonalInfoFormState>>;
  isLoading: boolean;
}

const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = ({ 
  formData, 
  handleChange, 
  handleSubmit, 
  setFormData, 
  isLoading 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Personlige oplysninger</h3>
        <p className="text-sm text-muted-foreground">
          Disse oplysninger bruges til at generere dine ansøgninger
        </p>
      </div>
      
      {/* Render PersonalInfoForm with props */}
    </div>
  );
};

export default ProfilePersonalInfo;
