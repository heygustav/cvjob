
import React from "react";
import AccountSettings from "@/components/profile/AccountSettings";

const ProfileAccountSettings: React.FC = () => {
  return (
    <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 text-left">Kontoindstillinger</h2>
        <AccountSettings />
      </div>
    </div>
  );
};

export default ProfileAccountSettings;
