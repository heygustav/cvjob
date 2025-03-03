
import React, { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { PersonalInfoFormState } from "@/pages/Profile";
import PersonalInfoForm from "@/components/PersonalInfoForm";

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
  // Create a mock user object with the required fields
  const user = {
    id: "",
    email: formData.email,
    name: formData.name,
    phone: formData.phone,
    address: formData.address,
    profileComplete: false
  };

  const handleSave = (data: any) => {
    // Map data to formData structure
    setFormData({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      experience: data.experience,
      education: data.education,
      skills: data.skills
    });
    
    // Submit the form
    const event = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
    handleSubmit(event);
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Personlige oplysninger</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Disse oplysninger bruges til at generere dine ansøgninger
        </p>
      </div>
      
      <PersonalInfoForm
        user={user}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProfilePersonalInfo;
