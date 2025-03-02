
import React from "react";
import { Button } from "@/components/ui/button";
import { File, Briefcase } from "lucide-react";

interface TabNavProps {
  activeTab: "letters" | "jobs";
  onTabChange: (tab: "letters" | "jobs") => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-2 px-4 sm:px-6">
        <Button
          variant={activeTab === "letters" ? "default" : "ghost"}
          className={`${
            activeTab === "letters"
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-gray-900"
          } -mb-px border-b-2 border-transparent py-4 px-1 font-medium flex items-center`}
          onClick={() => onTabChange("letters")}
        >
          <File className="mr-2 h-4 w-4" />
          Mine ansøgninger
        </Button>
        <Button
          variant={activeTab === "jobs" ? "default" : "ghost"}
          className={`${
            activeTab === "jobs"
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-gray-900"
          } -mb-px border-b-2 border-transparent py-4 px-1 font-medium flex items-center`}
          onClick={() => onTabChange("jobs")}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Mine jobopslag
        </Button>
      </div>
    </div>
  );
};

export default TabNav;
