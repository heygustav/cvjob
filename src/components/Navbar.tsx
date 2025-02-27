
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, FileText, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
    } border-b border-gray-200`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-xl font-medium tracking-tight text-gray-900 flex items-center"
            aria-label="Winston AI homepage"
          >
            <span className="text-xl sm:text-2xl font-semibold truncate max-w-[180px] sm:max-w-none">Winston AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label="Main navigation">
            {session ? (
              <>
                <Link 
                  to="/generator" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1 ${
                    isActive("/generator") ? "text-blue-600" : "text-gray-600"
                  }`}
                  aria-current={isActive("/generator") ? "page" : undefined}
                >
                  Opret ansøgning
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1 ${
                    isActive("/dashboard") ? "text-blue-600" : "text-gray-600"
                  }`}
                  aria-current={isActive("/dashboard") ? "page" : undefined}
                >
                  Gemte ansøgninger
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1 ${
                    isActive("/profile") ? "text-blue-600" : "text-gray-600"
                  }`}
                  aria-current={isActive("/profile") ? "page" : undefined}
                >
                  Min profil
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1"
                  aria-label="Log ud af din konto"
                >
                  <LogOut className="h-4 w-4 mr-1" aria-hidden="true" />
                  Log ud
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className={`text-sm font-medium transition-colors hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-1 ${
                    isActive("/auth") || isActive("/login") ? "text-blue-600" : "text-gray-600"
                  }`}
                  aria-current={(isActive("/auth") || isActive("/login")) ? "page" : undefined}
                >
                  Log ind
                </Link>
                <Link 
                  to="/auth?signup=true" 
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  aria-label="Opret ny konto"
                >
                  Opret konto
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
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
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen 
            ? "max-h-screen opacity-100" 
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="space-y-1 px-4 py-6 bg-gray-50 border-t border-gray-200">
          {session ? (
            <>
              <Link
                to="/generator"
                className={`flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-white transition-colors ${
                  isActive("/generator") ? "bg-white text-blue-600" : "text-gray-700"
                }`}
                aria-current={isActive("/generator") ? "page" : undefined}
              >
                <PlusCircle className="h-5 w-5 mr-3" aria-hidden="true" />
                Opret ansøgning
              </Link>
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-white transition-colors ${
                  isActive("/dashboard") ? "bg-white text-blue-600" : "text-gray-700"
                }`}
                aria-current={isActive("/dashboard") ? "page" : undefined}
              >
                <FileText className="h-5 w-5 mr-3" aria-hidden="true" />
                Gemte ansøgninger
              </Link>
              <Link
                to="/profile"
                className={`flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-white transition-colors ${
                  isActive("/profile") ? "bg-white text-blue-600" : "text-gray-700"
                }`}
                aria-current={isActive("/profile") ? "page" : undefined}
              >
                <User className="h-5 w-5 mr-3" aria-hidden="true" />
                Min profil
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-base font-medium rounded-md hover:bg-white transition-colors text-left text-gray-700"
                aria-label="Log ud af din konto"
              >
                <LogOut className="h-5 w-5 mr-3" aria-hidden="true" />
                Log ud
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className={`block w-full px-4 py-3 text-base font-medium rounded-md hover:bg-white transition-colors ${
                  isActive("/auth") || isActive("/login") ? "bg-white text-blue-600" : "text-gray-700"
                }`}
                aria-current={(isActive("/auth") || isActive("/login")) ? "page" : undefined}
              >
                Log ind
              </Link>
              <Link
                to="/auth?signup=true"
                className="block w-full mt-2 px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                aria-label="Opret ny konto"
              >
                Opret konto
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
