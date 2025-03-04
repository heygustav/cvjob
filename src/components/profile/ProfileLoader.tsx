
import React from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ProfileLoader: React.FC = () => {
  return <LoadingSpinner message="Indlæser profil..." />;
};

export default ProfileLoader;
