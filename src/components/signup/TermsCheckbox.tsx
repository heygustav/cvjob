
import React from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

const TermsCheckbox: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          name="terms"
          required
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          Jeg accepterer{" "}
          <Link to="/terms" className="font-medium text-primary hover:text-primary-800">
            Brugsbetingelserne
          </Link>{" "}
          og{" "}
          <Link to="/privacy" className="font-medium text-primary hover:text-primary-800">
            Privatlivspolitikken
          </Link>
        </label>
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox
          id="gdpr"
          name="gdpr"
          required
          className="mt-1"
        />
        <label htmlFor="gdpr" className="text-sm text-gray-700">
          Jeg accepterer, at mine personoplysninger behandles i henhold til{" "}
          <Link to="/gdpr-info" className="font-medium text-primary hover:text-primary-800">
            GDPR
          </Link>{" "}
          og jeg er bekendt med mine rettigheder
        </label>
      </div>
    </div>
  );
};

export default TermsCheckbox;
