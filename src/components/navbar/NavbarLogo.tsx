
import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react"; // Direct import for critical components

// Using React.memo to prevent unnecessary re-renders
const NavbarLogo: React.FC = React.memo(() => {
  return (
    <Link 
      to="/" 
      className="text-xl font-medium tracking-tight text-white flex items-center gap-2"
      aria-label="CVJob homepage"
    >
      <FileText className="h-5 w-5" />
      <span className="text-xl sm:text-2xl font-semibold truncate max-w-[180px] sm:max-w-none">CVJob</span>
    </Link>
  );
});

// Add displayName for better debugging
NavbarLogo.displayName = 'NavbarLogo';

export default NavbarLogo;
