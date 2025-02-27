
import React from "react";

interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-lg text-gray-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
