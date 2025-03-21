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
  // Base classes with improved accessibility
  const baseLinkClass = "flex items-center gap-2 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary";
  
  // Responsive padding with larger touch targets
  const linkClass = isMobile
    ? `${baseLinkClass} py-3 px-4 hover:bg-primary-700 w-full min-h-[48px]`
    : `${baseLinkClass} px-3 py-2 hover:bg-primary-700`;

  const buttonClass = isMobile
    ? "w-full justify-start gap-2 text-white hover:bg-primary-700 hover:text-white min-h-[48px] px-4 py-3"
    : "gap-2 text-white hover:bg-primary-700 hover:text-white";

  return (
    <>
      <li>
        <Link to="/" className={linkClass} aria-label="Go to homepage">
          <Home className="h-5 w-5" aria-hidden="true" />
          <span>Forsiden</span>
        </Link>
      </li>
      
      {session && (
        <li>
          <Link to="/dashboard" className={linkClass} aria-label="Go to dashboard">
            <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        </li>
      )}
      
      {session && (
        <li>
          <Link to="/ansoegning" className={linkClass} aria-label="Create application">
            <PenTool className="h-5 w-5" aria-hidden="true" />
            <span>Opret ansøgning</span>
          </Link>
        </li>
      )}
      
      {session && (
        <li>
          <Link to="/resume" className={linkClass} aria-label="CV Generator">
            <FileText className="h-5 w-5" aria-hidden="true" />
            <span>CV Generator</span>
          </Link>
        </li>
      )}
      
      {session ? (
        <>
          <li>
            <Link to="/profile" className={linkClass} aria-label="Go to profile">
              <UserCircle className="h-5 w-5" aria-hidden="true" />
              <span>Profil</span>
            </Link>
          </li>
          
          <li>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={buttonClass}
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span>Log ud</span>
            </Button>
          </li>
        </>
      ) : (
        <li>
          <Link to="/auth" className={linkClass} aria-label="Sign in or create account">
            <UserCircle className="h-5 w-5" aria-hidden="true" />
            <span>Log ind / Opret en konto</span>
          </Link>
        </li>
      )}
    </>
  );
};

export default NavLinks;
