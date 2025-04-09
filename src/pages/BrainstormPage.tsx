
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { generateBrainstormIdeas } from "@/services/brainstorm/generator";
import { Lightbulb, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BrainstormPage = () => {
  const [keywords, setKeywords] = useState<string>("");
  const [generationTriggered, setGenerationTriggered] = useState(false);
  const { toast } = useToast();

  // React Query for caching the brainstorm ideas
  const {
    data: ideas,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["brainstorm-ideas", keywords],
    queryFn: () => generateBrainstormIdeas(keywords),
    enabled: false, // Don't run the query automatically
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });

  const handleGenerateIdeas = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Indtast venligst nogle stikord",
        description: "Du skal indtaste stikord for at få idéer",
        variant: "destructive",
      });
      return;
    }

    setGenerationTriggered(true);
    refetch();
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Lightbulb className="h-7 w-7 text-yellow-500" />
          Brainstorm kompetencebeskrivelser
        </h1>
        <p className="text-muted-foreground">
          Få nye kreative måder at beskrive dine faglige kompetencer på til dit CV eller ansøgning
        </p>
      </header>

      <section className="mb-8">
        <div className="grid gap-4">
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-2">
              Indtast stikord om din kompetence
            </label>
            <Textarea
              id="keywords"
              placeholder="F.eks. 'projektledelse', 'React udvikling', 'kundeservice'"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Jo mere specifik du er, jo bedre idéer vil AI'en kunne give dig.
            </p>
          </div>

          <Button 
            onClick={handleGenerateIdeas}
            disabled={isLoading || isFetching || !keywords.trim()}
            className="w-full md:w-auto"
            size="lg"
          >
            {(isLoading || isFetching) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Genererer idéer...
              </>
            ) : (
              "Få idéer"
            )}
          </Button>
        </div>
      </section>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-8">
          <h3 className="font-medium mb-1">Der opstod en fejl</h3>
          <p className="text-sm">{error instanceof Error ? error.message : "Kunne ikke generere idéer. Prøv igen senere."}</p>
        </div>
      )}

      {generationTriggered && ideas && (
        <section className="bg-muted/50 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Idéer til at beskrive "{keywords}"</h2>
          
          <ul className="list-disc pl-5 space-y-3">
            {ideas.map((idea, index) => (
              <li key={index} className="text-foreground">
                {idea}
              </li>
            ))}
          </ul>
          
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={handleGenerateIdeas}
              disabled={isLoading || isFetching}
            >
              Generer nye idéer
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default BrainstormPage;
