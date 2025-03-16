
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import NavbarLogo from "./NavbarLogo";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { session, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
  };

  // Close menu if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 backdrop-blur-md shadow-md dark:bg-gray-900/90" 
        : "bg-transparent"
    }`}>
      <div className="gradient-header transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavbarLogo />
            <DesktopNavigation session={session} handleLogout={handleLogout} />
            <div className="mobile-menu-container">
              <MobileNavigation 
                isOpen={isOpen} 
                toggleMenu={toggleMenu} 
                session={session} 
                handleLogout={handleLogout} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Navbar;
