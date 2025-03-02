
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
      <div className="flex gap-4 px-4 sm:px-6">
        <Button
          variant={activeTab === "letters" ? "default" : "ghost"}
          className={`${
            activeTab === "letters"
              ? "bg-primary text-white"
              : "text-gray-600 hover:text-gray-900"
          } rounded-none rounded-t-lg px-6 py-3 h-auto font-medium flex items-center focus:outline-none focus:ring-0`}
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
          } rounded-none rounded-t-lg px-6 py-3 h-auto font-medium flex items-center focus:outline-none focus:ring-0`}
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
