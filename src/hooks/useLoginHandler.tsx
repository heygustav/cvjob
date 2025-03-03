
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export const useLoginHandler = (onLogin: (userId: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for stored redirect URL on mount
  useEffect(() => {
    const storedRedirect = localStorage.getItem('redirectAfterLogin');
    if (storedRedirect) {
      setRedirectUrl(storedRedirect);
      // Clear it immediately to avoid unwanted redirects later
      localStorage.removeItem('redirectAfterLogin');
    }
  }, []);

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate login process with demo user
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        
        if (user) {
          // In a real app, you would check the password
          // For demo purposes, we'll just log in the user
          onLogin(user.id);
          toast({
            title: "Login succesfuldt",
            description: `Velkommen tilbage, ${user.name}!`,
          });
          
          // Redirect to stored URL if available, otherwise to dashboard
          if (redirectUrl) {
            console.log("Redirecting to:", redirectUrl);
            window.location.href = redirectUrl;
          } else {
            navigate("/dashboard");
          }
        } else {
          toast({
            title: "Login mislykkedes",
            description: "Ugyldig email eller adgangskode. Prøv at bruge demo@example.com",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Login mislykkedes",
        description: "Der opstod en fejl under login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    redirectUrl,
    handleSubmit
  };
};
