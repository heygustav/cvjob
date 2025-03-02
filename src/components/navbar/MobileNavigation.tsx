
import React from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";

interface MobileNavigationProps {
  isOpen: boolean;
  toggleMenu: () => void;
  session: any;
  handleLogout: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  isOpen, 
  toggleMenu, 
  session, 
  handleLogout 
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex items-center p-2 rounded-md text-primary hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close main menu" : "Open main menu"}
        aria-controls="mobile-menu"
      >
        <span className="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed left-0 right-0 top-16 z-40 transition-all duration-300 ease-in-out ${
          isOpen 
            ? "max-h-screen opacity-100" 
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="space-y-1 px-4 py-6 bg-white border-t border-gray-200 shadow-lg">
          <NavLinks session={session} handleLogout={handleLogout} isMobile={true} />
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
