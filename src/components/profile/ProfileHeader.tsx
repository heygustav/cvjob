
import React from "react";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8 text-left">
      <h1 className={cn("text-3xl font-bold leading-tight text-gray-900")}>
        {title}
      </h1>
      <p className={cn("mt-1 text-lg text-gray-600")}>
        {subtitle}
      </p>
    </div>
  );
};

export default ProfileHeader;
