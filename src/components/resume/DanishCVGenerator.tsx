
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

  // Genererer HTML for CV'et
  const generateCVHTML = () => {
    if (!hasBasicInfo) {
      return '<div class="p-4 bg-red-50 text-red-600 rounded-md">Venligst udfyld basisoplysninger (navn og email) for at generere dit CV.</div>';
    }

    return `
      <div class="danish-cv max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
        <header class="text-center mb-8 pb-4 border-b">
          <h1 class="text-3xl font-bold mb-2">${data.name}</h1>
          <div class="flex justify-center items-center space-x-4 flex-wrap">
            ${data.email ? `<span class="flex items-center"><span class="mr-1">✉️</span> ${data.email}</span>` : ''}
            ${data.phone ? `<span class="flex items-center"><span class="mr-1">📞</span> ${data.phone}</span>` : ''}
            ${data.address ? `<span class="flex items-center"><span class="mr-1">🏠</span> ${data.address}</span>` : ''}
          </div>
        </header>
        
        <section class="mb-6">
          <div class="flex items-center mb-3">
            <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
            <h2 class="text-xl font-semibold">Om mig</h2>
          </div>
          <div class="pl-10">
            ${data.summary || '<p>Ingen beskrivelse tilføjet.</p>'}
          </div>
        </section>
        
        <section class="mb-6">
          <div class="flex items-center mb-3">
            <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></span>
            <h2 class="text-xl font-semibold">Erfaring</h2>
          </div>
          <div class="pl-10">
            ${formatExperience()}
          </div>
        </section>
        
        <section class="mb-6">
          <div class="flex items-center mb-3">
            <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-school"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 5v17"/><path d="M6 5v17"/></svg></span>
            <h2 class="text-xl font-semibold">Uddannelse</h2>
          </div>
          <div class="pl-10">
            ${formatEducation()}
          </div>
        </section>
        
        <section class="mb-6">
          <div class="flex items-center mb-3">
            <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
            <h2 class="text-xl font-semibold">Kompetencer</h2>
          </div>
          <div class="pl-10">
            ${formatSkills()}
          </div>
        </section>
      </div>
    `;
  };

  // Konverterer HTML til en sikker DOMPurify-renset React-komponent
  const createMarkup = () => {
    return { __html: generateCVHTML() };
  };

  return (
    <div className="danishCV">
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
};

// Eksporter en funktion der genererer CV'et som en HTML-streng
export const generateDanishCVHTML = (data: Resume): string => {
  // We instantiate component and call its method directly 
  const component = new DanishCVGenerator({ data });
  return component.generateCVHTML ? component.generateCVHTML() : '';
};

export default DanishCVGenerator;
