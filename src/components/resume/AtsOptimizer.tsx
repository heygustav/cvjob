
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Resume } from "@/types/resume";
import { analyzeResume } from "@/utils/resume/keywordAnalyzer";
import { AlertTriangle, CheckCircle, Search } from "lucide-react";

interface AtsOptimizerProps {
  resumeData: Resume;
}

const AtsOptimizer: React.FC<AtsOptimizerProps> = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    recommendations: string[];
    keywordsFound: string[];
    keywordsMissing: string[];
  } | null>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    
    // Simulate a short delay to show the analyzing state
    setTimeout(() => {
      const analysisResults = analyzeResume({
        resume: resumeData,
        jobDescription: jobDescription.trim() ? jobDescription : undefined
      });
      
      setResults(analysisResults);
      setAnalyzing(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500"; 
    return "bg-red-500";
  };

  return (
    <Card className="p-4 border shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">ATS-optimeringsanalyse</h3>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Indsæt et jobopslag for at analysere dit CV for ATS-kompatibilitet og få personlige anbefalinger.
          </p>
          <Textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Indsæt jobopslag her..."
            rows={4}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={analyzing || (!resumeData.name && !resumeData.summary)}
          className="w-full"
        >
          {analyzing ? "Analyserer..." : "Analyser CV"}
        </Button>

        {results && (
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ATS-kompatibilitetsscore</span>
                <span className="text-sm font-bold">{results.score}%</span>
              </div>
              <Progress 
                value={results.score} 
                max={100} 
                className={`h-2 ${getScoreColor(results.score)}`}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Anbefalinger
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {results.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {results.keywordsFound.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Fundne nøgleord ({results.keywordsFound.length})
                </h4>
                <div className="flex flex-wrap gap-1">
                  {results.keywordsFound.map((keyword, i) => (
                    <span 
                      key={i}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.keywordsMissing.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Manglende nøgleord ({results.keywordsMissing.length})
                </h4>
                <div className="flex flex-wrap gap-1">
                  {results.keywordsMissing.slice(0, 15).map((keyword, i) => (
                    <span 
                      key={i}
                      className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {results.keywordsMissing.length > 15 && (
                    <span className="text-xs text-gray-500">
                      +{results.keywordsMissing.length - 15} flere
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AtsOptimizer;
