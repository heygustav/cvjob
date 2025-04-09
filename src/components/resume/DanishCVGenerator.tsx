
import React from "react";
import { Resume } from "@/types/resume";
import { Book, Briefcase, User, School, Star } from "lucide-react";
import CommonLayout from "@/components/ui/CommonLayout";

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
        <div key={exp.id} className="mb-4">
          <h4 className="font-medium">{exp.position}</h4>
          <p className="text-muted-foreground">{exp.organization} | {exp.fromDate} - {exp.toDate}</p>
          <ul className="list-disc pl-5 mt-2">
            {exp.bulletPoints.map((point, idx) => <li key={idx}>{point}</li>)}
          </ul>
        </div>
      ));
    } else if (data.experience) {
      // Hvis vi kun har ustruktureret erfaring
      return <p>{data.experience}</p>;
    }
    return <p>Ingen erfaring tilføjet.</p>;
  };

  // Funktion til at formatere struktureret uddannelse til tekst
  const formatEducation = () => {
    if (data.structuredEducation && data.structuredEducation.length > 0) {
      return data.structuredEducation.map((edu) => (
        <div key={edu.id} className="mb-4">
          <h4 className="font-medium">{edu.education}</h4>
          <p className="text-muted-foreground">{edu.school} | {edu.fromDate} - {edu.toDate}</p>
          <ul className="list-disc pl-5 mt-2">
            {edu.bulletPoints.map((point, idx) => <li key={idx}>{point}</li>)}
          </ul>
        </div>
      ));
    } else if (data.education) {
      // Hvis vi kun har ustruktureret uddannelse
      return <p>{data.education}</p>;
    }
    return <p>Ingen uddannelse tilføjet.</p>;
  };
  
  // Funktion til at formatere strukturerede kompetencer til tekst
  const formatSkills = () => {
    if (data.structuredSkills && data.structuredSkills.length > 0) {
      return data.structuredSkills.map((skill) => (
        <div key={skill.id} className="mb-2">
          <span className="font-medium">{skill.skill}</span> ({skill.years} års erfaring)
          {skill.bulletPoints.length > 0 && (
            <ul className="list-disc pl-5 mt-1">
              {skill.bulletPoints.map((point, idx) => <li key={idx}>{point}</li>)}
            </ul>
          )}
        </div>
      ));
    } else if (data.skills) {
      // Hvis vi kun har ustrukturerede kompetencer
      return <p>{data.skills}</p>;
    }
    return <p>Ingen kompetencer tilføjet.</p>;
  };

  // Generer CV-indholdet som React komponenter
  const generateBodyContent = () => {
    if (!hasBasicInfo) {
      return <div>Venligst udfyld basisoplysninger (navn og email)</div>;
    }
    
    return (
      <>
        {data.summary && (
          <section className="mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
              <User className="h-5 w-5" /> Om mig
            </h3>
            <div>{data.summary}</div>
          </section>
        )}

        <section className="mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <Briefcase className="h-5 w-5" /> Erhvervserfaring
          </h3>
          {formatExperience()}
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <School className="h-5 w-5" /> Uddannelse
          </h3>
          {formatEducation()}
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <Star className="h-5 w-5" /> Kompetencer
          </h3>
          {formatSkills()}
        </section>
      </>
    );
  };

  return (
    <div className="danishCV">
      <CommonLayout
        name={data.name || ""}
        title="Curriculum Vitae"
        bodyContent={generateBodyContent()}
        contactInfo={{
          email: data.email,
          phone: data.phone,
          address: data.address
        }}
      />
    </div>
  );
};

// Export a function that generates CV HTML without using 'new'
export const generateDanishCVHTML = (data: Resume): string => {
  // Dette er en forenklet version der kun bruges til at generere HTML uden React
  const hasBasicInfo = data.name && data.email;
  
  if (!hasBasicInfo) {
    return '<div>Venligst udfyld basisoplysninger (navn og email)</div>';
  }
  
  // Direkte HTML generering (forenklet)
  return `
    <div class="danish-cv">
      <header class="mb-6 border-b pb-4">
        <h1 class="text-2xl font-bold">${data.name}</h1>
        <h2 class="text-lg text-muted-foreground">Curriculum Vitae</h2>
      </header>

      <main class="mb-6">
        ${data.summary ? `
          <section class="mb-6">
            <h3 class="text-xl font-semibold mb-3">Om mig</h3>
            <div>${data.summary}</div>
          </section>
        ` : ''}
      </main>

      <footer class="border-t pt-4 text-sm">
        <div class="flex flex-wrap gap-4">
          <div>Email: ${data.email}</div>
          ${data.phone ? `<div>Telefon: ${data.phone}</div>` : ''}
          ${data.address ? `<div>Adresse: ${data.address}</div>` : ''}
        </div>
      </footer>
    </div>
  `;
};

export default DanishCVGenerator;
