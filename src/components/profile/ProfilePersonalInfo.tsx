
import React, { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import { PersonalInfoForm } from "@/components/PersonalInfoForm";

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
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Personlige oplysninger</h3>
        <p className="text-sm text-muted-foreground">
          Disse oplysninger bruges til at generere dine ansøgninger
        </p>
      </div>
      
      <PersonalInfoForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProfilePersonalInfo;
