
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Resume } from "@/types/resume";

interface DanishResumeActionsProps {
  resumeData: Resume;
}

const DanishResumeActions: React.FC<DanishResumeActionsProps> = ({
  resumeData
}) => {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    // Fjern HTML-tags for at få rent tekst til udklipsholder
    const tempElement = document.createElement('div');
    tempElement.innerHTML = document.querySelector('.danish-cv')?.innerHTML || '';
    const textContent = tempElement.textContent || tempElement.innerText || '';
    
    navigator.clipboard.writeText(textContent).then(() => {
      toast({
        title: "Kopieret til udklipsholder",
        description: "Dit CV er nu kopieret og klar til at blive indsat.",
      });
    }).catch(err => {
      console.error('Kunne ikke kopiere tekst: ', err);
      toast({
        title: "Fejl ved kopiering",
        description: "Der opstod en fejl. Prøv venligst igen.",
        variant: "destructive",
      });
    });
  };

  const handleDownloadAsHTML = () => {
    const htmlContent = document.querySelector('.danish-cv')?.outerHTML || '';
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.name.replace(/\s+/g, '_')}_CV.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CV downloadet",
      description: "Dit CV er blevet downloadet som HTML-fil.",
    });
  };

  const handleDownloadAsText = () => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = document.querySelector('.danish-cv')?.innerHTML || '';
    const textContent = tempElement.textContent || tempElement.innerText || '';
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.name.replace(/\s+/g, '_')}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CV downloadet",
      description: "Dit CV er blevet downloadet som tekstfil.",
    });
  };

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopyToClipboard}
        className="flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        Kopier til udklipsholder
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownloadAsHTML}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download som HTML
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownloadAsText}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Download som tekst
      </Button>
    </div>
  );
};

export default DanishResumeActions;
