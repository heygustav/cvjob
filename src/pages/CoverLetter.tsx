
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface CoverLetterProps {
  userId: string;
}

const CoverLetter: React.FC<CoverLetterProps> = ({ userId }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState<any>(null);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      if (!id) {
        // If no ID provided, go to generator mode
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        // Check if the cover letter belongs to the current user
        if (data.user_id !== userId) {
          toast({
            title: 'Adgang nægtet',
            description: 'Du har ikke adgang til denne ansøgning.',
            variant: 'destructive',
          });
          navigate('/dashboard');
          return;
        }

        setCoverLetter(data);
      } catch (error) {
        console.error('Error fetching cover letter:', error);
        toast({
          title: 'Fejl ved indlæsning',
          description: 'Kunne ikke indlæse ansøgningen.',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoverLetter();
  }, [id, navigate, toast, userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Render either editor or generator based on whether an ID was provided
  return (
    <div className="container mx-auto px-4 py-8">
      {id ? (
        // Viewing/editing existing letter
        <div>
          <h1 className="text-2xl font-bold mb-4">Ansøgning</h1>
          {coverLetter && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="whitespace-pre-wrap">{coverLetter.content}</div>
            </div>
          )}
        </div>
      ) : (
        // Creating new letter
        <div>
          <h1 className="text-2xl font-bold mb-4">Opret Ansøgning</h1>
          <p>Her kan du oprette en ny ansøgning.</p>
          {/* Generator content would go here */}
        </div>
      )}
    </div>
  );
};

export default CoverLetter;
