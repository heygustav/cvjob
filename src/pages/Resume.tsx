
import React from "react";
import ResumeBuilder from "@/components/resume/ResumeBuilder";
import { Card, CardContent } from "@/components/ui/card";

const ResumeGuide = () => (
  <Card className="mb-8 bg-white">
    <CardContent className="p-6">
      <h2 className="text-xl font-bold mb-4">Opret et ATS-venligt CV</h2>
      <p className="mb-4">
        Dit CV bliver automatisk formateret i henhold til best practices for CV'er, der 
        skal igennem et Applicant Tracking System (ATS):
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>Bruger ATS-venlige skrifttyper (Arial) og formateringer</li>
        <li>Standardiseret struktur med tydelige sektionstitler</li>
        <li>Korrekt struktureret med kontaktoplysninger, resumé, erhvervserfaring, uddannelse og kompetencer</li>
        <li>Mulighed for download som PDF eller DOCX med ensartet formatering</li>
      </ul>
      <p>
        Udfyld formularen nedenfor for at oprette dit professionelle CV. Jo flere detaljer du 
        tilføjer, desto bedre bliver resultatet.
      </p>
    </CardContent>
  </Card>
);

const Resume: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <ResumeGuide />
        <ResumeBuilder />
      </div>
    </div>
  );
};

export default Resume;
