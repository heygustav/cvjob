
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, FileText, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { session, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    signOut();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-xl font-medium tracking-tight text-gray-900 flex items-center"
            onClick={closeMenu}
          >
            <span className="text-2xl font-semibold">JobMagic</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {session ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    isActive("/dashboard") ? "text-black" : "text-gray-600"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/generator" 
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    isActive("/generator") ? "text-black" : "text-gray-600"
                  }`}
                >
                  Opret Ansøgning
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    isActive("/profile") ? "text-black" : "text-gray-600"
                  }`}
                >
                  Profil
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Log ud
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  className={`text-sm font-medium transition-colors hover:text-black ${
                    isActive("/auth") || isActive("/login") ? "text-black" : "text-gray-600"
                  }`}
                >
                  Log ind
                </Link>
                <Link 
                  to="/auth?signup=true" 
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                >
                  Opret konto
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center p-2"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Åbn hovedmenu</span>
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
        className={`md:hidden ${
          isOpen ? "fixed inset-0 z-40 bg-white pt-16" : "hidden"
        }`}
      >
        <div className="space-y-1 px-4 py-6">
          {session ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-50"
                onClick={closeMenu}
              >
                <FileText className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
              <Link
                to="/generator"
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-50"
                onClick={closeMenu}
              >
                <PlusCircle className="h-5 w-5 mr-3" />
                Opret Ansøgning
              </Link>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-50"
                onClick={closeMenu}
              >
                <User className="h-5 w-5 mr-3" />
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-3 text-base font-medium rounded-md hover:bg-gray-50 text-left"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Log ud
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="block w-full px-4 py-3 text-base font-medium rounded-md hover:bg-gray-50"
                onClick={closeMenu}
              >
                Log ind
              </Link>
              <Link
                to="/auth?signup=true"
                className="block w-full mt-2 px-4 py-3 text-base font-medium bg-black text-white rounded-md hover:bg-gray-800 text-center"
                onClick={closeMenu}
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
