
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '../LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Fetch the current session to confirm authentication
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast({
            title: 'Verifikation mislykkedes',
            description: 'Der opstod en fejl under verifikation. Prøv at logge ind igen.',
            variant: 'destructive',
          });
          navigate('/auth');
          return;
        }

        if (!session) {
          console.warn('No session found during callback');
          toast({
            title: 'Ingen session fundet',
            description: 'Prøv at logge ind igen.',
            variant: 'destructive',
          });
          navigate('/auth');
          return;
        }

        console.log('Authentication successful, redirecting to dashboard');
        
        // Check if there's a stored redirect URL
        const storedRedirect = localStorage.getItem('redirectAfterLogin');
        if (storedRedirect) {
          console.log('Redirecting to stored URL:', storedRedirect);
          localStorage.removeItem('redirectAfterLogin');
          navigate(storedRedirect);
        } else {
          // Default redirect to dashboard
          toast({
            title: 'Verifikation gennemført',
            description: 'Din konto er nu verificeret. Du er logget ind.',
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        toast({
          title: 'Uventet fejl',
          description: 'Der opstod en uventet fejl. Prøv at logge ind igen.',
          variant: 'destructive',
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Verificerer din konto...</p>
    </div>
  );
};

export default AuthCallback;
