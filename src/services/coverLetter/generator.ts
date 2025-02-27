
import { supabase } from "@/integrations/supabase/client";
import { JobFormData, UserProfile } from "./types";

export const generateCoverLetter = async (
  jobInfo: JobFormData,
  userInfo: UserProfile
): Promise<string> => {
  console.log("Starting cover letter generation with job info:", {
    title: jobInfo.title,
    company: jobInfo.company,
    contactPerson: jobInfo.contact_person,
  });
  console.log("User profile for generation:", {
    hasName: !!userInfo.name,
    hasEmail: !!userInfo.email,
    hasExperience: !!userInfo.experience,
    hasEducation: !!userInfo.education,
    hasSkills: !!userInfo.skills,
  });
  
  try {
    console.log("Preparing to call edge function for letter generation");
    
    // Basic validation
    if (!jobInfo.title || !jobInfo.company || !jobInfo.description) {
      throw new Error('Manglende joboplysninger. Udfyld venligst alle påkrævede felter.');
    }
    
    // Call the edge function directly - no complex Promise racing
    console.log("Calling Supabase function with job info");
    const { data, error } = await supabase.functions.invoke(
      'generate-cover-letter',
      {
        body: {
          jobInfo: {
            title: jobInfo.title,
            company: jobInfo.company,
            description: jobInfo.description,
            contactPerson: jobInfo.contact_person,
            url: jobInfo.url
          },
          userInfo: {
            name: userInfo.name || '',
            email: userInfo.email || '',
            phone: userInfo.phone || '',
            address: userInfo.address || '',
            experience: userInfo.experience || '',
            education: userInfo.education || '',
            skills: userInfo.skills || '',
          },
          locale: navigator.language,
          model: "gpt-4",
          temperature: 0.5,
          promptTemplate: `
Som en professionel jobansøger, skriv en overbevisende og detaljeret ansøgning til stillingen som {jobTitle} hos {company},
adresseret til {contactPerson}. Brug følgende information om ansøgeren:

Navn: {name}
Email: {email}
Telefon: {phone}
Adresse: {address}
Erfaring: {experience}
Uddannelse: {education}
Færdigheder: {skills}

Jobopslag:
{jobDescription}

Følg disse retningslinjer for at skrive ansøgningen:

1. Start direkte med en stærk og fængende indledning, der straks fanger læserens opmærksomhed.
2. Brug konkrete og specifikke eksempler på færdigheder og resultater. Vær detaljeret og kvantificer præstationer hvor muligt.
3. Forklar grundigt, hvorfor ansøgeren er interesseret i denne specifikke stilling.
4. Uddyb hvordan kompetencerne matcher præcis det, som virksomheden/organisationen leder efter til stillingen. Brug specifikke eksempler.
5. Beskriv hvordan ansøgerens personlige og professionelle værdier aligner med virksomhedens værdier og kultur.
6. Afslut med en klar opfordring til handling og udtryk, at ansøgeren ser frem til muligheden for at uddybe ved en personlig samtale.

Skriv ansøgningen på dansk og hold den professionel, engagerende og overbevisende. Sørg for, at ansøgningen er grundig og detaljeret,
med en optimal længde for en motiveret jobansøgning (typisk omkring 400-600 ord eller 1-1.5 A4-sider).

VIGTIGT: 
- IKKE inkluder "Dato:", "Til:", "Fra:", "Emne:" eller lignende formelle e-mail-headers. 
- IKKE gentag virksomhedens navn og jobstilling i starten af ansøgningen, da dette allerede vil være indsat i layoutet.
- Start ansøgningen med "Kære {contactPerson}" (eller passende alternativ hvis ingen kontaktperson er oplyst).
- IKKE afslut med "Med venlig hilsen" og navn, da dette vil blive tilføjet automatisk senere.

Match tonen i jobopslaget uden at gentage de samme ord og sætninger, undtagen hvor det er nødvendigt for at forklare tekniske kvalifikationer eller lignende krav. Skab en autentisk stemme, der resonerer med virksomhedskulturen, mens du bevarer originalitet.
          `
        }
      }
    );

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Fejl ved generering af ansøgning: ${error.message || "Ukendt fejl"}`);
    }

    if (!data || !data.content) {
      console.error("No content received from edge function:", data);
      throw new Error("Intet indhold modtaget fra serveren");
    }

    console.log("Successfully received content from edge function, length:", data.content.length);
    return data.content;
    
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    
    // Handle network errors
    if (!navigator.onLine || (error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('connection') || 
         error.message.includes('offline')))) {
      throw new Error('Der opstod en netværksfejl. Kontroller din forbindelse og prøv igen.');
    }
    
    // For other errors, re-throw with appropriate message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Der opstod en fejl ved generering af ansøgningen. Prøv igen senere.");
    }
  }
};
