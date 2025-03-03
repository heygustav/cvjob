
import React from "react";
import { Button } from "@/components/ui/button";
import { File, Briefcase } from "lucide-react";

interface TabNavProps {
  activeTab: "letters" | "jobs";
  onTabChange: (tab: "letters" | "jobs") => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="flex">
        <Button
          variant="ghost"
          size="lg"
          className={`${
            activeTab === "letters"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600 hover:text-gray-900"
          } flex-1 rounded-none px-6 py-4 h-auto font-medium flex items-center justify-start focus:outline-none`}
          onClick={() => onTabChange("letters")}
        >
          <File className="h-5 w-5 mr-2" /> {/* Standardized size and spacing */}
          Ansøgninger
        </Button>
        <Button
          variant="ghost" 
          size="lg"
          className={`${
            activeTab === "jobs"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-600 hover:text-gray-900"
          } flex-1 rounded-none px-6 py-4 h-auto font-medium flex items-center justify-start focus:outline-none`}
          onClick={() => onTabChange("jobs")}
        >
          <Briefcase className="h-5 w-5 mr-2" /> {/* Standardized size and spacing */}
          Jobopslag
        </Button>
      </div>
    </div>
  );
};

export default TabNav;
