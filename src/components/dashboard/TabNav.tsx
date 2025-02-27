
import React from "react";

interface TabNavProps {
  activeTab: "letters" | "jobs";
  onTabChange: (tab: "letters" | "jobs") => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-6 px-6" aria-label="Tabs">
        <button
          onClick={() => onTabChange("letters")}
          className={`
            py-4 text-sm font-medium border-b-2 px-1 text-left
            ${
              activeTab === "letters"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
          aria-current={activeTab === "letters" ? "page" : undefined}
        >
          Ansøgninger
        </button>
      </nav>
    </div>
  );
};

export default TabNav;
