
import React from "react";
import AccountSettings from "@/components/profile/AccountSettings";

const ProfileAccountSettings: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Kontoindstillinger</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Administrer dine kontoindstillinger og sikkerhed
        </p>
      </div>
      <AccountSettings />
    </div>
  );
};

export default ProfileAccountSettings;
