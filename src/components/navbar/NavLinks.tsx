
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  PenTool,
  UserCircle,
  LogOut,
  Home,
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
  const linkClass = isMobile
    ? "flex items-center gap-2 py-2 px-3 rounded-md text-white hover:bg-primary-700 transition-colors w-full"
    : "flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-primary-700 transition-colors";

  const buttonClass = isMobile
    ? "w-full justify-start gap-2"
    : "gap-2";

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
        <Link to="/generator" className={linkClass}>
          <PenTool className="h-4 w-4" />
          Opret ansøgning
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
