
import React from "react";
import { Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { DesktopNavLinks } from "./NavLinks";

interface DesktopNavigationProps {
  session: Session | null;
  handleLogout: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  session, 
  handleLogout 
}) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      {/* Navigation links for authenticated users */}
      <DesktopNavLinks session={session} />

      {/* Authentication buttons */}
      {session ? (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout} 
          className="text-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log ud
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Log ind
            </Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <Link to="/signup">Tilmeld</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default DesktopNavigation;
