
import React from "react";
import { Building, Briefcase } from "lucide-react";

interface EmptyStateMessageProps {
  type: "jobs" | "companies";
  title: string;
  description: string;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ type, title, description }) => {
  const Icon = type === "jobs" ? Briefcase : Building;

  return (
    <div className="flex flex-col items-start py-12 px-4 text-left" aria-live="polite">
      <div className="rounded-full bg-gray-100 p-5 mb-5">
        <Icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 max-w-md mb-6">
        {description}
      </p>
    </div>
  );
};

export default EmptyStateMessage;
