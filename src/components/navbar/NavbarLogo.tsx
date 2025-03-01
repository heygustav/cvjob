
import React from "react";
import { Link } from "react-router-dom";

const NavbarLogo: React.FC = () => {
  return (
    <Link 
      to="/" 
      className="text-xl font-medium tracking-tight text-white flex items-center"
      aria-label="CVJob homepage"
    >
      <span className="text-xl sm:text-2xl font-semibold truncate max-w-[180px] sm:max-w-none">CVJob</span>
    </Link>
  );
};

export default NavbarLogo;
