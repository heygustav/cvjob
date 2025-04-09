
import React from "react";
import { gdprText } from "@/content/gdprContent";
import { Separator } from "@/components/ui/separator";

const GDPRInfoPage: React.FC = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{gdprText.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{gdprText.summary}</p>
        
        <div className="space-y-8">
          {gdprText.sections.map((section, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <p className="text-gray-700">{section.content}</p>
            </div>
          ))}
        </div>
        
        <Separator className="my-8" />
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-8">
          <h2 className="text-xl font-semibold mb-3">Kontakt vedrørende GDPR</h2>
          <p>{gdprText.footer}</p>
          <div className="mt-4">
            <a 
              href="mailto:privacy@cvjob.dk" 
              className="text-primary hover:underline font-medium"
            >
              privacy@cvjob.dk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPRInfoPage;
