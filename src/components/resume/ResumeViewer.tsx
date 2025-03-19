
import React from "react";
import { UserProfile } from "@/services/coverLetter/types";
import { ResumeOptions } from "@/pages/ResumeBuilder";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useFormattedDate } from "@/utils/date/useFormattedDate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ResumeViewerProps {
  profile: UserProfile;
  options: ResumeOptions;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ profile, options }) => {
  const { formattedDate } = useFormattedDate();
  const resumeRef = React.useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    const printContents = resumeRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;
    
    if (printContents) {
      document.body.innerHTML = `
        <style>
          @page { margin: 2cm; }
          body { font-family: ${options.font === 'TimesNewRoman' ? 'Times New Roman, serif' : 'Arial, sans-serif'}; }
          h1, h2, h3 { margin-top: 1em; margin-bottom: 0.5em; }
          .resume-section { margin-bottom: 1.5em; }
          .resume-header { margin-bottom: 2em; }
        </style>
        <div>${printContents}</div>
      `;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };
  
  const handleDownload = () => {
    // This would be expanded to generate PDF in a real implementation
    // using libraries like jspdf and html2canvas
    console.log("Download functionality would be implemented here");
    
    // For now, just trigger print as it's a similar result
    handlePrint();
  };
  
  const formatSection = (content: string) => {
    if (!content) return [];
    return content.split('\n').filter(line => line.trim().length > 0);
  };
  
  const experienceLines = formatSection(profile.experience || '');
  const educationLines = formatSection(profile.education || '');
  const skillsLines = formatSection(profile.skills || '');
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end space-x-2 p-4 border-b">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <div className="overflow-auto p-8 flex-grow bg-white">
        <div 
          ref={resumeRef}
          className={`max-w-4xl mx-auto ${options.font === 'TimesNewRoman' ? 'font-serif' : 'font-sans'}`}
          style={{ fontFamily: options.font === 'TimesNewRoman' ? 'Times New Roman, serif' : 'Arial, sans-serif' }}
        >
          <div className="resume-header flex items-start">
            {options.includePhoto && (
              <div className="mr-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={profile.name} />
                  <AvatarFallback>{profile.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
            )}
            
            <div className="flex-grow">
              <h1 className="text-2xl font-bold">{profile.name || 'Intet navn angivet'}</h1>
              
              <div className="mt-2 text-gray-600">
                {(profile.email || profile.phone || profile.address) ? (
                  <>
                    {profile.email && <div>{profile.email}</div>}
                    {profile.phone && <div>{profile.phone}</div>}
                    {profile.address && <div>{profile.address}</div>}
                  </>
                ) : (
                  <div>Ingen kontaktoplysninger angivet</div>
                )}
              </div>
            </div>
            
            <div className="text-gray-500 text-right">
              {formattedDate}
            </div>
          </div>
          
          <div className="resume-section mt-8">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Erhvervserfaring</h2>
            {experienceLines.length > 0 ? (
              <div className="pl-4">
                {experienceLines.map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Ingen erhvervserfaring angivet</p>
            )}
          </div>
          
          <div className="resume-section mt-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Uddannelse</h2>
            {educationLines.length > 0 ? (
              <div className="pl-4">
                {educationLines.map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Ingen uddannelse angivet</p>
            )}
          </div>
          
          <div className="resume-section mt-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-3">Kompetencer & kvalifikationer</h2>
            {skillsLines.length > 0 ? (
              <div className="pl-4">
                {skillsLines.map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Ingen kompetencer angivet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
