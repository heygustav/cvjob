
import React, { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import BackToTop from '../components/BackToTop';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useToast } from '../hooks/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = memo(({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { toast } = useToast();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show welcome toast on homepage
  useEffect(() => {
    if (location.pathname === '/' && !sessionStorage.getItem('welcomed')) {
      toast({
        title: "Velkommen til CVjob",
        description: "Scroll ned for at se vores funktioner og hvordan du kommer i gang.",
      });
      sessionStorage.setItem('welcomed', 'true');
    }
  }, [location.pathname, toast]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="pt-16 min-h-[calc(100vh-4rem)]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <BackToTop threshold={300} showLabel />
    </>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
