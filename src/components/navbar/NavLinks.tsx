
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  PenTool,
  UserCircle,
  LogOut,
  Home,
  FileText,
} from "lucide-react";

interface NavLinksProps {
  session: any;
  handleLogout: () => void;
  isMobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({
  session,
  handleLogout,
  isMobile = false,
}) => {
  // Define a safer version of links with security enhancements
  const linkClass = isMobile
    ? "flex items-center gap-2 py-2 px-3 rounded-md text-white hover:bg-primary-700 transition-colors w-full"
    : "flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-primary-700 transition-colors";

  const buttonClass = isMobile
    ? "w-full justify-start gap-2 text-white hover:bg-primary-700 hover:text-white"
    : "gap-2 text-white hover:bg-primary-700 hover:text-white";

  return (
    <>
      <Link to="/" className={linkClass}>
        <Home className="h-4 w-4" />
        Forsiden
      </Link>
      
      {session && (
        <Link to="/dashboard" className={linkClass}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      )}
      
      {session && (
        <Link to="/ansoegning" className={linkClass}>
          <PenTool className="h-4 w-4" />
          Opret ansøgning
        </Link>
      )}
      
      {session && (
        <Link to="/resume" className={linkClass}>
          <FileText className="h-4 w-4" />
          CV Generator
        </Link>
      )}
      
      {session ? (
        <>
          <Link to="/profile" className={linkClass}>
            <UserCircle className="h-4 w-4" />
            Profil
          </Link>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={buttonClass}
          >
            <LogOut className="h-4 w-4" />
            Log ud
          </Button>
        </>
      ) : (
        <Link to="/auth" className={linkClass}>
          Log ind
        </Link>
      )}
    </>
  );
};

export default NavLinks;
