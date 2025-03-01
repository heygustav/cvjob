
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, FileText, PlusCircle, User } from "lucide-react";

interface NavLinksProps {
  session: any;
  handleLogout: () => void;
  isMobile?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ 
  session, 
  handleLogout, 
  isMobile = false 
}) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (session) {
    return (
      <>
        <Link
          to="/generator"
          className={`${isMobile ? "flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-primary/90 active:bg-primary-900 transition-colors" : "text-sm font-medium transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"} ${
            isActive("/generator") 
              ? isMobile ? "bg-primary-700 text-white" : "text-white" 
              : "text-primary-100"
          }`}
          aria-current={isActive("/generator") ? "page" : undefined}
        >
          {isMobile && <PlusCircle className="h-5 w-5 mr-3" aria-hidden="true" />}
          Opret ansøgning
        </Link>
        <Link
          to="/dashboard"
          className={`${isMobile ? "flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-primary/90 active:bg-primary-900 transition-colors" : "text-sm font-medium transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"} ${
            isActive("/dashboard") 
              ? isMobile ? "bg-primary-700 text-white" : "text-white" 
              : "text-primary-100"
          }`}
          aria-current={isActive("/dashboard") ? "page" : undefined}
        >
          {isMobile && <FileText className="h-5 w-5 mr-3" aria-hidden="true" />}
          Gemte ansøgninger
        </Link>
        <Link
          to="/profile"
          className={`${isMobile ? "flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-primary/90 active:bg-primary-900 transition-colors" : "text-sm font-medium transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"} ${
            isActive("/profile") 
              ? isMobile ? "bg-primary-700 text-white" : "text-white" 
              : "text-primary-100"
          }`}
          aria-current={isActive("/profile") ? "page" : undefined}
        >
          {isMobile && <User className="h-5 w-5 mr-3" aria-hidden="true" />}
          Min profil
        </Link>
        <button
          onClick={handleLogout}
          className={`${isMobile 
            ? "flex w-full items-center px-4 py-3 text-base font-medium rounded-md hover:bg-primary/90 active:bg-primary-900 transition-colors text-left text-primary-100" 
            : "text-sm font-medium text-primary-100 hover:text-white transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"}`}
          aria-label="Log ud af din konto"
        >
          <LogOut className={`${isMobile ? "h-5 w-5 mr-3" : "h-4 w-4 mr-1"}`} aria-hidden="true" />
          Log ud
        </button>
      </>
    );
  }

  return (
    <>
      <Link 
        to="/auth" 
        className={`${isMobile 
          ? "block w-full px-4 py-3 text-base font-medium rounded-md hover:bg-primary/90 active:bg-primary-900 transition-colors" 
          : "text-sm font-medium transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary rounded px-2 py-1"} ${
          (isActive("/auth") || isActive("/login")) 
            ? isMobile ? "bg-primary-700 text-white" : "text-white" 
            : "text-primary-100"
        }`}
        aria-current={(isActive("/auth") || isActive("/login")) ? "page" : undefined}
      >
        Log ind
      </Link>
      <Link 
        to="/auth?signup=true" 
        className={isMobile 
          ? "block w-full mt-2 px-4 py-3 text-base font-medium bg-white text-primary rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors text-center"
          : "px-4 py-2 text-sm font-medium text-primary bg-white rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        }
        aria-label="Opret ny konto"
      >
        Opret konto
      </Link>
    </>
  );
};

export default NavLinks;
