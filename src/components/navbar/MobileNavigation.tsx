
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
        className="md:hidden flex items-center p-2 rounded-md text-white hover:bg-primary-800 active:bg-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Luk hovedmenu" : "Åbn hovedmenu"}
        aria-controls="mobile-menu"
      >
        <span className="sr-only">{isOpen ? "Luk hovedmenu" : "Åbn hovedmenu"}</span>
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
        <div className="space-y-1 px-4 py-6 bg-primary-800 border-t border-primary-600 shadow-lg">
          <NavLinks session={session} handleLogout={handleLogout} isMobile={true} />
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
