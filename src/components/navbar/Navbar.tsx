
import React, { useCallback, useState } from "react";
import { useAuth } from '../AuthProvider';
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import NavbarLogo from "./NavbarLogo";
import { sanitizeRedirectUrl } from "@/hooks/auth/authUtils";
import { useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, signOut, isLoggingOut } = useAuth();
  const location = useLocation();
  
  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const handleLogout = useCallback(async () => {
    try {
      // Store current path as redirect URL in localStorage
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        const redirectPath = sanitizeRedirectUrl(location.pathname + location.search);
        if (redirectPath) {
          localStorage.setItem('redirectAfterLogin', redirectPath);
        }
      }
      
      await signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [location.pathname, location.search, signOut]);
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <NavbarLogo />
        
        <DesktopNavigation 
          session={session} 
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
        
        <MobileNavigation 
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          session={session}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </header>
  );
};

export default Navbar;
