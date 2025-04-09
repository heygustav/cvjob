
import React from "react";

interface CommonLayoutProps {
  name: string;
  title?: string;
  bodyContent: React.ReactNode;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

/**
 * En fælles layout-skabelon til CV og ansøgninger
 * Sikrer konsistent struktur på tværs af dokumenter
 */
const CommonLayout: React.FC<CommonLayoutProps> = ({
  name,
  title,
  bodyContent,
  contactInfo
}) => {
  return (
    <div className="document-container">
      {/* Header - Kan ikke ændres i rækkefølge */}
      <header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{name}</h1>
        {title && <h2 className="text-lg text-muted-foreground">{title}</h2>}
      </header>

      {/* Body - Hovedindhold */}
      <main className="mb-6">
        {bodyContent}
      </main>

      {/* Footer - Kontaktoplysninger */}
      <footer className="border-t pt-4 text-sm">
        <div className="flex flex-wrap gap-4">
          {contactInfo?.email && (
            <div>Email: {contactInfo.email}</div>
          )}
          {contactInfo?.phone && (
            <div>Telefon: {contactInfo.phone}</div>
          )}
          {contactInfo?.address && (
            <div>Adresse: {contactInfo.address}</div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CommonLayout;
