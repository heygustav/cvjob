
import React from "react";

const TermsCheckbox: React.FC = () => {
  return (
    <div className="flex items-center">
      <input
        id="terms"
        name="terms"
        type="checkbox"
        required
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
        Jeg accepterer{" "}
        <a href="#" className="font-medium text-primary hover:text-primary-800">
          Brugsbetingelserne
        </a>{" "}
        og{" "}
        <a href="#" className="font-medium text-primary hover:text-primary-800">
          Privatlivspolitikken
        </a>
      </label>
    </div>
  );
};

export default TermsCheckbox;
