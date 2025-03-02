
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Home,
  LayoutDashboard,
  PenTool,
  Info,
  Phone,
  UserCircle,
  LogOut
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
    ? "flex items-center gap-2 py-2 px-3 rounded-md text-gray-200 hover:bg-primary-800 transition-colors w-full"
    : "flex items-center gap-2 px-3 py-2 rounded-md text-white hover:bg-primary-800 transition-colors";

  const buttonClass = isMobile
    ? "w-full justify-start gap-2 bg-transparent text-gray-200 hover:bg-primary-800 hover:text-white"
    : "gap-2 bg-transparent text-white hover:bg-primary-800 hover:text-white";

  return (
    <>
      <Link to="/" className={linkClass}>
        <Home className="h-4 w-4" />
        Home
      </Link>
      
      {session && (
        <Link to="/dashboard" className={linkClass}>
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      )}
      
      {session && (
        <Link to="/cover-letter" className={linkClass}>
          <PenTool className="h-4 w-4" />
          Create Cover Letter
        </Link>
      )}
      
      <Link to="/about" className={linkClass}>
        <Info className="h-4 w-4" />
        About
      </Link>
      
      <Link to="/contact" className={linkClass}>
        <Phone className="h-4 w-4" />
        Contact
      </Link>
      
      {session ? (
        <>
          <Link to="/profile" className={linkClass}>
            <UserCircle className="h-4 w-4" />
            Profile
          </Link>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={buttonClass}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </>
      ) : (
        <Link to="/auth" className={`${linkClass} font-medium hover:text-white`}>
          Log in
        </Link>
      )}
    </>
  );
};

export default NavLinks;
