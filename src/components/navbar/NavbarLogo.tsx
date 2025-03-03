
import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react"; // Direct import for critical components

interface NavbarLogoProps {
  className?: string;
}

// Using React.memo to prevent unnecessary re-renders with optimized implementation
const NavbarLogo = React.memo(({ className = "" }: NavbarLogoProps) => {
  return (
    <Link 
      to="/" 
      className={`text-xl font-medium tracking-tight text-white flex items-center gap-2 transition-opacity hover:opacity-90 ${className}`}
      aria-label="CVJob homepage"
    >
      <FileText className="h-5 w-5" aria-hidden="true" />
      <span className="text-xl sm:text-2xl font-semibold truncate max-w-[180px] sm:max-w-none">
        CVJob
      </span>
    </Link>
  );
});

// Add displayName for better debugging
NavbarLogo.displayName = 'NavbarLogo';

export default NavbarLogo;
