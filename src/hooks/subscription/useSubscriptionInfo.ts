
import { useState, useEffect, useRef } from "react";
import { User } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSubscriptionInfo = (user: User) => {
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>("checking");
  const [dbStatus, setDbStatus] = useState<string>("checking");
  const [browserInfo, setBrowserInfo] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Checking authentication status...");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth check error:", error);
        setAuthStatus("error");
        setError(`Autentificeringsfejl: ${error.message}`);
        return;
      }
      
      setAuthStatus(data.session ? "authenticated" : "unauthenticated");
    } catch (err) {
      console.error("Auth check exception:", err);
      setAuthStatus("error");
    }
  };

  const checkDatabase = async () => {
    try {
      console.log("Testing database connection...");
      const startTime = performance.now();
      
      const { data, error } = await supabase.from("profiles").select("count").limit(1);
      
      const endTime = performance.now();
      console.log(`Database connection test took ${endTime - startTime}ms`);
      
      if (error) {
        console.error("Database connection error:", error);
        setDbStatus("error");
        setError(`Databasefejl: ${error.message}`);
        return;
      }
      
      setDbStatus("connected");
    } catch (err) {
      console.error("Database check exception:", err);
      setDbStatus("error");
    }
  };

  useEffect(() => {
    const storeBrowserInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        cookiesEnabled: navigator.cookieEnabled,
        language: navigator.language
      };
      
      setBrowserInfo(JSON.stringify(info, null, 2));
      console.log("Browser environment:", info);
    };

    storeBrowserInfo();
    checkAuth();
    checkDatabase();

    const handleResize = () => {
      console.log("Window resized:", window.innerWidth, "x", window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    error,
    authStatus,
    dbStatus,
    browserInfo,
    isRefreshing,
    setIsRefreshing,
    setError
  };
};
