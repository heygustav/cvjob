
import React from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ProfileLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <LoadingSpinner message="Indlæser profil..." />
    </div>
  );
};

export default ProfileLoader;
