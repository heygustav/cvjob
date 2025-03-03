
import React from "react";

export interface ProfileHeaderProps {
  title?: string;
  subtitle?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  title = "Profil", 
  subtitle = "Administrer dine personoplysninger og indstillinger"
}) => {
  return (
    <div className="mb-8 text-left">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
};

export default ProfileHeader;
