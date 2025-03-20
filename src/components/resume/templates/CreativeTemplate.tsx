
import React from "react";
import { Resume } from "@/types/resume";

interface CreativeTemplateProps {
  data: Resume;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => (
  <div className="font-sans">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 bg-indigo-100 p-4 rounded-lg">
        {data.photo && (
          <div className="mb-4 flex justify-center">
            <img 
              src={data.photo} 
              alt="Profilbillede" 
              className="w-24 h-24 object-cover rounded-full border-2 border-indigo-300"
            />
          </div>
        )}
        <h1 className="text-xl font-bold text-indigo-900 mb-2">{data.name}</h1>
        {data.summary && (
          <p className="mb-4 text-indigo-800 italic">{data.summary}</p>
        )}
        <div className="text-indigo-800 space-y-1">
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.address && <div>{data.address}</div>}
        </div>
        
        {data.skills && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-indigo-900 mb-2 pb-1">Kompetencer</h2>
            <div className="border-t border-indigo-900 pt-2 mt-1 mb-3"></div>
            <div className="whitespace-pre-line text-indigo-800">{data.skills}</div>
          </div>
        )}
      </div>
      
      <div className="md:w-2/3">
        {data.experience && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">Erhvervserfaring</h2>
            <div className="border-t border-black pt-2 mt-1 mb-3"></div>
            <div className="whitespace-pre-line text-gray-700">{data.experience}</div>
          </div>
        )}
        
        {data.education && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">Uddannelse</h2>
            <div className="border-t border-black pt-2 mt-1 mb-3"></div>
            <div className="whitespace-pre-line text-gray-700">{data.education}</div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default CreativeTemplate;
