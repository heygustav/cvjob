import React from "react";
import { Resume } from "@/types/resume";
import { Book, Briefcase, User, School, Star } from "lucide-react";

interface DanishCVGeneratorProps {
  data: Resume;
}

/**
 * Genererer et dansk CV i HTML format baseret på brugerens profildata
 */
const DanishCVGenerator: React.FC<DanishCVGeneratorProps> = ({ data }) => {
  // Kontrollerer at vi har de nødvendige data
  const hasBasicInfo = data.name && data.email;
  
  // Funktion til at formatere struktureret erfaring til tekst
  const formatExperience = () => {
    if (data.structuredExperience && data.structuredExperience.length > 0) {
      return data.structuredExperience.map((exp) => (
        `<div key="${exp.id}" class="mb-4">
          <h4 class="font-medium">${exp.position}</h4>
          <p class="text-muted-foreground">${exp.organization} | ${exp.fromDate} - ${exp.toDate}</p>
          <ul class="list-disc pl-5 mt-2">
            ${exp.bulletPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>`
      )).join('');
    } else if (data.experience) {
      // Hvis vi kun har ustruktureret erfaring
      return `<p>${data.experience}</p>`;
    }
    return '<p>Ingen erfaring tilføjet.</p>';
  };

  // Funktion til at formatere struktureret uddannelse til tekst
  const formatEducation = () => {
    if (data.structuredEducation && data.structuredEducation.length > 0) {
      return data.structuredEducation.map((edu) => (
        `<div key="${edu.id}" class="mb-4">
          <h4 class="font-medium">${edu.education}</h4>
          <p class="text-muted-foreground">${edu.school} | ${edu.fromDate} - ${edu.toDate}</p>
          <ul class="list-disc pl-5 mt-2">
            ${edu.bulletPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>`
      )).join('');
    } else if (data.education) {
      // Hvis vi kun har ustruktureret uddannelse
      return `<p>${data.education}</p>`;
    }
    return '<p>Ingen uddannelse tilføjet.</p>';
  };
  
  // Funktion til at formatere strukturerede kompetencer til tekst
  const formatSkills = () => {
    if (data.structuredSkills && data.structuredSkills.length > 0) {
      return data.structuredSkills.map((skill) => (
        `<div key="${skill.id}" class="mb-2">
          <span class="font-medium">${skill.skill}</span> (${skill.years} års erfaring)
          ${skill.bulletPoints.length > 0 ? 
            `<ul class="list-disc pl-5 mt-1">
              ${skill.bulletPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>` : ''}
        </div>`
      )).join('');
    } else if (data.skills) {
      // Hvis vi kun har ustrukturerede kompetencer
      return `<p>${data.skills}</p>`;
    }
    return '<p>Ingen kompetencer tilføjet.</p>';
  };

  // Modify the generateDanishCVHTML to be a static method
  const generateCVHTML = () => {
    const hasBasicInfo = data.name && data.email;
    
    if (!hasBasicInfo) {
      return '<div>Venligst udfyld basisoplysninger (navn og email)</div>';
    }
    
    // Directly return the HTML generation logic
    return `
      <div class="danish-cv">
        <h1>${data.name}</h1>
        <p>${data.email}</p>
        <p>${data.phone || ''}</p>
        <div>${data.summary || ''}</div>
      </div>
    `;
  };

  // Modify the createMarkup method to use the generateCVHTML method
  const createMarkup = () => {
    return { __html: generateCVHTML() };
  };

  return (
    <div className="danishCV">
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
};

// Export a function that generates CV HTML without using 'new'
export const generateDanishCVHTML = (data: Resume): string => {
  const hasBasicInfo = data.name && data.email;
  
  if (!hasBasicInfo) {
    return '<div>Venligst udfyld basisoplysninger (navn og email)</div>';
  }
  
  // Directly return the HTML generation logic
  return `
    <div class="danish-cv">
      <h1>${data.name}</h1>
      <p>${data.email}</p>
      <p>${data.phone || ''}</p>
      <div>${data.summary || ''}</div>
    </div>
  `;
};

export default DanishCVGenerator;
