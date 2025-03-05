
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '../LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast({
            title: 'Verifikation mislykkedes',
            description: 'Der opstod en fejl under verifikation. Prøv at logge ind igen.',
            variant: 'destructive',
          });
          navigate('/login');
          return;
        }

        toast({
          title: 'Verifikation gennemført',
          description: 'Din konto er nu verificeret. Du er logget ind.',
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        toast({
          title: 'Uventet fejl',
          description: 'Der opstod en uventet fejl. Prøv at logge ind igen.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600">Verificerer din konto...</p>
    </div>
  );
};

export default AuthCallback;
