
import React from "react";
import NavLinks from "./NavLinks";

interface DesktopNavigationProps {
  session: any;
  handleLogout: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ session, handleLogout }) => {
  return (
    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label="Main navigation">
      <NavLinks session={session} handleLogout={handleLogout} />
    </nav>
  );
};

export default DesktopNavigation;
