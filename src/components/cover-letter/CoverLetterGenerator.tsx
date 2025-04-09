
import React from "react";
import { CoverLetter } from "@/lib/types";
import CommonLayout from "@/components/ui/CommonLayout";

interface CoverLetterGeneratorProps {
  data: CoverLetter;
  jobTitle?: string;
  company?: string;
  contactPerson?: string;
  userInfo?: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

/**
 * Generator til motiveret ansøgning baseret på brugerens data
 */
const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ 
  data, 
  jobTitle, 
  company, 
  contactPerson,
  userInfo = { name: "", email: "" }
}) => {
  // Tjek om vi har det nødvendige indhold
  if (!data?.content) {
    return <div>Ingen ansøgningstekst tilgængelig</div>;
  }

  // Formatér ansøgningsteksten med bevarede linjeskift
  const formatContent = () => {
    // Split på linjeskift og behold tomme linjer
    const paragraphs = data.content.split('\n');
    
    return (
      <div className="whitespace-pre-wrap">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className={paragraph.trim() === '' ? 'mt-4' : ''}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="cover-letter">
      <CommonLayout
        name={userInfo.name}
        title={`Ansøgning: ${jobTitle || 'Stilling'} - ${company || 'Virksomhed'}`}
        bodyContent={formatContent()}
        contactInfo={{
          email: userInfo.email,
          phone: userInfo.phone,
          address: userInfo.address
        }}
      />
    </div>
  );
};

export default CoverLetterGenerator;
