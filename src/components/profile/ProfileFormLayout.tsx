
import React, { ReactNode } from "react";
import FormActions from "./FormActions";

interface ProfileFormLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isFormValid?: boolean;
}

const ProfileFormLayout: React.FC<ProfileFormLayoutProps> = ({
  children,
  title,
  description,
  onSubmit,
  isLoading,
  isFormValid = true
}) => {
  return (
    <div className="space-y-6 p-8 text-left">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6 text-left">
        {children}
        <FormActions isLoading={isLoading} isFormValid={isFormValid} />
      </form>
    </div>
  );
};

export default ProfileFormLayout;
