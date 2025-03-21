import React from "react";
import { Resume } from "@/types/resume";

interface ClassicTemplateProps {
  data: Resume;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => (
  <div className="font-serif">
    <div className="text-center mb-6">
      {data.photo && (
        <div className="flex justify-center mb-3">
          <img 
            src={data.photo} 
            alt="Profilbillede" 
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
      {data.summary && (
        <p className="mt-2 text-gray-700 italic max-w-lg mx-auto">{data.summary}</p>
      )}
      <div className="mt-2 text-gray-600">
        {data.email && <div>{data.email}</div>}
        {data.phone && <div>{data.phone}</div>}
        {data.address && <div>{data.address}</div>}
      </div>
    </div>
    
    {((data.structuredExperience && data.structuredExperience.length > 0) || data.experience) && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">
          Erhvervserfaring
        </h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredExperience && data.structuredExperience.length > 0 ? (
          <div className="space-y-4">
            {data.structuredExperience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="text-center mb-2">
                  <h3 className="font-medium">{exp.position}</h3>
                  <div className="text-gray-700">{exp.organization}</div>
                  <div className="text-sm text-gray-600">
                    {exp.fromDate} - {exp.toDate || 'Nu'}
                  </div>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 text-left">
                    {exp.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-line text-gray-700 mt-3">{data.experience}</div>
        )}
      </div>
    )}
    
    {((data.structuredEducation && data.structuredEducation.length > 0) || data.education) && (
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">
          Uddannelse
        </h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredEducation && data.structuredEducation.length > 0 ? (
          <div className="space-y-4">
            {data.structuredEducation.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="text-center mb-2">
                  <h3 className="font-medium">{edu.education}</h3>
                  <div className="text-gray-700">{edu.school}</div>
                  <div className="text-sm text-gray-600">
                    {edu.fromDate} - {edu.toDate || 'Nu'}
                  </div>
                </div>
                {edu.bulletPoints && edu.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 text-left">
                    {edu.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-line text-gray-700 mt-3">{data.education}</div>
        )}
      </div>
    )}
    
    {((data.structuredSkills && data.structuredSkills.length > 0) || data.skills) && (
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 pb-1">
          Kompetencer
        </h2>
        <div className="border-t border-black pt-2 mt-1 mb-3"></div>
        
        {data.structuredSkills && data.structuredSkills.length > 0 ? (
          <div className="space-y-4">
            {data.structuredSkills.map((skill) => (
              <div key={skill.id} className="mb-3">
                <div className="text-center mb-2">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-600 ml-2">({skill.years} år)</span>
                </div>
                {skill.bulletPoints && skill.bulletPoints.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 text-left">
                    {skill.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="whitespace-pre-line text-gray-700 mt-3">{data.skills}</div>
        )}
      </div>
    )}
  </div>
);

export default ClassicTemplate;
