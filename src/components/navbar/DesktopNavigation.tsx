
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { DesktopNavLinks } from "./NavLinks";

interface DesktopNavigationProps {
  session: Session | null;
  handleLogout: () => void;
  isLoggingOut: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  session, 
  handleLogout,
  isLoggingOut
}) => {
  const onLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleLogout();
  }, [handleLogout]);

  return (
    <div className="hidden md:flex items-center gap-2 lg:gap-4">
      {/* Navigation links for authenticated users */}
      <DesktopNavLinks session={session} />

      {/* Authentication buttons */}
      {session ? (
        <>
          <Link 
            to="/profile" 
            data-tour="profile"
            className="text-foreground hover:text-primary transition-colors"
          >
            Min profil
          </Link>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLogout} 
            isLoading={isLoggingOut}
            loadingText="Logger ud..."
            className="text-foreground hover:bg-destructive/10 hover:text-destructive whitespace-nowrap text-xs lg:text-sm"
          >
            <LogOut className="h-4 w-4 mr-1 lg:mr-2 flex-shrink-0" />
            <span>Log ud</span>
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-1 lg:gap-2">
          <Button asChild variant="ghost" size="sm" className="whitespace-nowrap text-xs lg:text-sm">
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-1 lg:mr-2 flex-shrink-0" />
              <span>Log ind</span>
            </Link>
          </Button>
          <Button asChild variant="default" size="sm" className="whitespace-nowrap text-xs lg:text-sm">
            <Link to="/signup">Tilmeld</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(DesktopNavigation);
