
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

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
    ? "flex items-center gap-2 py-2 px-3 rounded-md text-gray-700 hover:bg-primary-100 transition-colors w-full"
    : "flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-primary-100 transition-colors";

  const buttonClass = isMobile
    ? "w-full justify-start gap-2 bg-transparent text-gray-700 hover:bg-primary-100 hover:text-gray-900"
    : "gap-2 bg-transparent text-gray-700 hover:bg-primary-100 hover:text-gray-900";

  return (
    <>
      <Link to="/" className={linkClass}>
        Home
      </Link>
      
      {session && (
        <Link to="/dashboard" className={linkClass}>
          Dashboard
        </Link>
      )}
      
      {session && (
        <Link to="/cover-letter" className={linkClass}>
          Create Cover Letter
        </Link>
      )}
      
      <Link to="/about" className={linkClass}>
        About
      </Link>
      
      <Link to="/contact" className={linkClass}>
        Contact
      </Link>
      
      {session ? (
        <>
          <Link to="/profile" className={linkClass}>
            Profile
          </Link>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={buttonClass}
          >
            Log out
          </Button>
        </>
      ) : (
        <Link to="/auth" className={`${linkClass} font-medium text-primary-600 hover:text-primary-800`}>
          Log in
        </Link>
      )}
    </>
  );
};

export default NavLinks;
