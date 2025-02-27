
import React from "react";
import { KeyRound, Mail, Trash2 } from "lucide-react";

const AccountSettings: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start py-3 border-b border-gray-200">
        <div className="flex items-start">
          <KeyRound className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Adgangskode</h3>
            <p className="text-sm text-gray-500 italic">Opdater din adgangskode</p>
          </div>
        </div>
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          Ændre
        </button>
      </div>
      
      <div className="flex justify-between items-start py-3 border-b border-gray-200">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">E-mailnotifikationer</h3>
            <p className="text-sm text-gray-500 italic">Administrer dine e-mailpræferencer</p>
          </div>
        </div>
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          Administrer
        </button>
      </div>
      
      <div className="flex justify-between items-start py-3">
        <div className="flex items-start">
          <Trash2 className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Slet konto</h3>
            <p className="text-sm text-gray-500 italic">Slet permanent din konto og alle data</p>
          </div>
        </div>
        <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
          Slet
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
