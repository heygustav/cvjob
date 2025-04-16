
import React from "react";
import { Button } from "@/components/ui/button";
import { File, Briefcase, Building } from "lucide-react";

interface TabNavProps {
  activeTab: "letters" | "jobs" | "companies";
  onTabChange: (tab: "letters" | "jobs" | "companies") => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6" role="tablist" aria-label="Dashboard Sektioner">
      <div className="flex">
        <Button
          variant="ghost"
          size="lg"
          className={`${
            activeTab === "letters"
              ? "border-b-2 border-primary text-primary bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          } flex-1 rounded-none px-6 py-4 h-auto font-medium flex items-center justify-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset transition-colors`}
          onClick={() => onTabChange("letters")}
          role="tab"
          id="tab-letters"
          aria-selected={activeTab === "letters"}
          aria-controls="panel-letters"
          tabIndex={activeTab === "letters" ? 0 : -1}
        >
          <File className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" /> 
          <span>Ansøgninger</span>
        </Button>
        <Button
          variant="ghost" 
          size="lg"
          className={`${
            activeTab === "jobs"
              ? "border-b-2 border-primary text-primary bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          } flex-1 rounded-none px-6 py-4 h-auto font-medium flex items-center justify-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset transition-colors`}
          onClick={() => onTabChange("jobs")}
          role="tab"
          id="tab-jobs"
          aria-selected={activeTab === "jobs"}
          aria-controls="panel-jobs"
          tabIndex={activeTab === "jobs" ? 0 : -1}
        >
          <Briefcase className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" /> 
          <span>Jobopslag</span>
        </Button>
        <Button
          variant="ghost" 
          size="lg"
          className={`${
            activeTab === "companies"
              ? "border-b-2 border-primary text-primary bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          } flex-1 rounded-none px-6 py-4 h-auto font-medium flex items-center justify-start focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset transition-colors`}
          onClick={() => onTabChange("companies")}
          role="tab"
          id="tab-companies"
          aria-selected={activeTab === "companies"}
          aria-controls="panel-companies"
          tabIndex={activeTab === "companies" ? 0 : -1}
        >
          <Building className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" /> 
          <span>Virksomheder</span>
        </Button>
      </div>
    </div>
  );
};

export default TabNav;
