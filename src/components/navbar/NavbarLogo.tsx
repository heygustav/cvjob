
import React from "react";
import { Link } from "react-router-dom";
import { commonIcons } from "@/components/ui/icon";

const NavbarLogo: React.FC = () => {
  return (
    <Link 
      to="/" 
      className="text-xl font-medium tracking-tight text-white flex items-center gap-2"
      aria-label="CVJob homepage"
    >
      <commonIcons.Document className="h-5 w-5" />
      <span className="text-xl sm:text-2xl font-semibold truncate max-w-[180px] sm:max-w-none">CVJob</span>
    </Link>
  );
};

export default NavbarLogo;
