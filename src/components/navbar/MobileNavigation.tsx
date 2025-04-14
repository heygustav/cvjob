
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { MobileNavLinks } from "./NavLinks";

interface MobileNavigationProps {
  isOpen: boolean;
  toggleMenu: () => void;
  session: Session | null;
  handleLogout: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  toggleMenu,
  session,
  handleLogout,
}) => {
  const onLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleLogout();
  }, [handleLogout]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50 touch-manipulation"
        aria-label={isOpen ? "Luk menu" : "Åbn menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile menu drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-background z-40 transform transition-transform ease-in-out duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden max-h-screen overflow-y-auto`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full p-4 sm:p-6 pt-16 overflow-y-auto max-h-[100vh]">
          <MobileNavLinks session={session} />

          <div className="mt-auto pt-6 border-t">
            {session ? (
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-destructive min-h-[44px]"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Log ud
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full justify-start min-h-[44px]">
                  <Link to="/login">
                    <LogIn className="h-5 w-5 mr-2" />
                    Log ind
                  </Link>
                </Button>
                <Button asChild variant="default" className="w-full justify-start min-h-[44px]">
                  <Link to="/signup">Tilmeld</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileNavigation);
