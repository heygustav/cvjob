
import React from "react";

interface TabNavProps {
  activeTab: "letters";
  onTabChange: (tab: "letters") => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex">
        <button
          className={`w-full py-4 px-1 text-center border-b-2 font-medium text-sm ${
            activeTab === "letters"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => onTabChange("letters")}
        >
          Ansøgninger
        </button>
      </nav>
    </div>
  );
};

export default TabNav;
