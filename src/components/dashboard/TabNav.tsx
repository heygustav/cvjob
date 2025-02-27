
import React from "react";

interface TabNavProps {
  activeTab: "jobs" | "letters";
  onTabChange: (tab: "jobs" | "letters") => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px" aria-label="Tabs">
        <button
          onClick={() => onTabChange("jobs")}
          className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === "jobs"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Jobopslag
        </button>
        <button
          onClick={() => onTabChange("letters")}
          className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === "letters"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Ansøgninger
        </button>
      </nav>
    </div>
  );
};

export default TabNav;
