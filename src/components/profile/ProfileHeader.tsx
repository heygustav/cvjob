
import React from "react";
import { UserRound } from "lucide-react";

interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-start">
        <div className="hidden sm:flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center mr-4">
          <UserRound className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-1 text-lg text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
