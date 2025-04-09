
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { FileText, Home, User, PlusCircle, Briefcase, Layers, Lightbulb } from 'lucide-react';

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, icon, isMobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors";
  const activeClasses = "bg-primary/10 text-primary font-medium";
  const inactiveClasses = "hover:bg-muted hover:text-foreground";
  
  return (
    <Link 
      to={to} 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isMobile ? 'w-full' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const DesktopNavLinks: React.FC<{ session: Session | null }> = ({ session }) => {
  if (!session) return null;
  
  return (
    <nav className="hidden md:flex items-center gap-1">
      <NavLink to="/dashboard" label="Dashboard" icon={<Home className="h-4 w-4" />} />
      <NavLink to="/resume/dk" label="CV" icon={<FileText className="h-4 w-4" />} />
      <NavLink to="/ansoegning" label="Ansøgning" icon={<PlusCircle className="h-4 w-4" />} />
      <NavLink to="/brainstorm" label="Brainstorm" icon={<Lightbulb className="h-4 w-4" />} />
      <NavLink to="/profile" label="Profil" icon={<User className="h-4 w-4" />} />
    </nav>
  );
};

export const MobileNavLinks: React.FC<{ session: Session | null }> = ({ session }) => {
  if (!session) return null;
  
  return (
    <nav className="flex flex-col w-full gap-1 mt-4">
      <NavLink to="/dashboard" label="Dashboard" icon={<Home className="h-5 w-5" />} isMobile />
      <NavLink to="/resume/dk" label="CV" icon={<FileText className="h-5 w-5" />} isMobile />
      <NavLink to="/ansoegning" label="Ansøgning" icon={<PlusCircle className="h-5 w-5" />} isMobile />
      <NavLink to="/brainstorm" label="Brainstorm" icon={<Lightbulb className="h-5 w-5" />} isMobile />
      <NavLink to="/profile" label="Profil" icon={<User className="h-5 w-5" />} isMobile />
    </nav>
  );
};
