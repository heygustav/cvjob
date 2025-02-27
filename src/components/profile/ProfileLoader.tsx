
import React from "react";

const ProfileLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default ProfileLoader;
