
import React from "react";
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
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50"
        aria-label={isOpen ? "Luk menu" : "Åbn menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile menu drawer */}
      <div
        className={`fixed inset-0 bg-background z-40 transform transition-transform ease-in-out duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          <MobileNavLinks session={session} />

          <div className="mt-auto pt-6 border-t">
            {session ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-destructive"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Log ud
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/login">
                    <LogIn className="h-5 w-5 mr-2" />
                    Log ind
                  </Link>
                </Button>
                <Button asChild variant="default" className="w-full justify-start">
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

export default MobileNavigation;
