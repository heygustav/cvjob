
import { supabase } from "@/integrations/supabase/client";
import { JobFormData, UserProfile } from "./types";
import DOMPurify from "dompurify";

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
    
    // Ensure we have values for required fields AND sanitize all inputs
    const title = jobInfo.title ? DOMPurify.sanitize(jobInfo.title) : "Untitled Position";
    const company = jobInfo.company ? DOMPurify.sanitize(jobInfo.company) : "Unknown Company";
    const description = jobInfo.description ? DOMPurify.sanitize(jobInfo.description) : "No description provided";
    const contactPerson = jobInfo.contact_person ? DOMPurify.sanitize(jobInfo.contact_person) : '';
    const url = jobInfo.url ? DOMPurify.sanitize(jobInfo.url) : '';
    
    // Sanitize user profile information
    const sanitizedUserInfo = {
      name: userInfo.name ? DOMPurify.sanitize(userInfo.name) : '',
      email: userInfo.email ? DOMPurify.sanitize(userInfo.email) : '',
      phone: userInfo.phone ? DOMPurify.sanitize(userInfo.phone) : '',
      address: userInfo.address ? DOMPurify.sanitize(userInfo.address) : '',
      experience: userInfo.experience ? DOMPurify.sanitize(userInfo.experience) : '',
      education: userInfo.education ? DOMPurify.sanitize(userInfo.education) : '',
      skills: userInfo.skills ? DOMPurify.sanitize(userInfo.skills) : '',
    };
    
    // Add request timeout handling
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 60000); // 60 second timeout
    });
    
    // Call the edge function with sanitized data
    const functionPromise = supabase.functions.invoke(
      'generate-cover-letter',
      {
        body: {
          jobInfo: {
            title: title,
            company: company,
            description: description,
            contactPerson: contactPerson,
            url: url
          },
          userInfo: sanitizedUserInfo,
          locale: navigator.language,
          model: "gpt-4",
          temperature: 0.5,
          promptTemplate: `
Som en professionel jobansøger skal du skrive en overbevisende og målrettet ansøgning til stillingen som {jobTitle} hos {company}, adresseret til {contactPerson}. Brug følgende oplysninger:

Ansøgerens profil:

Navn: {name}

Email: {email}

Telefon: {phone}

Adresse: {address}

Erfaring: {experience}

Uddannelse: {education}

Færdigheder: {skills}

Jobopslag:
{jobDescription}

Retningslinjer:

Start med en fængende indledning der fanger opmærksomhed og viser engagement (Eksempel: "Da jeg læste jeres opslag om X, vidste jeg, at mine erfaringer med Y direkte kan støtte jeres mål om Z").

Brug konkrete resultater med tal eller effekt (Undgå: "Jeg har erfaring med salg" → Brug: "Jeg øgede kundetilfredsheden med 30% gennem en ny kundehåndteringsproces").

Forklar din motivation med reference til virksomhedens værdier, projekter eller kultur (Eksempel: "Jeres fokus på bæredygtighed matcher min erfaring med at lede CO2-neutralisering i XX-projekter").

Kombiner faglige og personlige styrker til en helhedsprofil (Eksempel: "Mine tekniske kompetencer i Python kombineret med min erfaring som teamkoordinator gør mig effektiv i at oversætte komplekse løsninger til klare handlingsplaner").

Fokuser på virksomhedens behov – forklar, hvordan du løser deres udfordringer, ikke kun dine egne mål.

Integrér nøgleord fra jobopslaget naturligt (Eksempel: Hvis opslaget nævner "agil projektledelse", brug "Min erfaring med Scrum-metoder i en agile miljøer").

Sprog og tone:

Vær professionel men uformel efter dansk standard (Undgå: "Højtærede ledelse" → Brug: "Kære Anna").

Undgå klichéer uden kontekst (F.eks.: "Jeg er en stærk teamplayer" → Brug: "Min rolle som koordinator for en tværfaglig gruppe på 8 kolleger lærte mig at skabe fælles momentum under pres").

Formatering:

Maks 1 A4-side (400-500 ord) med linjeafstand 1-1.15.

Brug overskrifter som "Hvorfor jeg passer til jer" eller "Mine største relevante resultater".

Start med "Kære {contactPerson}" (eller "Kære [Virksomhedsnavn]-team" hvis ingen kontaktperson).

VIGTIGT:

INKLUDER IKKE formelle headers som "Til:", "Emne:", eller "Med venlig hilsen".

Gentag IKKE virksomhedens navn eller jobtitel i teksten.
          `
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Race the function call against the timeout
    const result = await Promise.race([functionPromise, timeoutPromise]);
    
    // Type assertion since we know the result is from the function call if we get here
    const { data, error } = result as Awaited<typeof functionPromise>;

    if (error) {
      console.error("Edge function error:", error);
      // Sanitize error messages to avoid information disclosure
      throw new Error(`Fejl ved generering af ansøgning. Prøv igen senere.`);
    }

    if (!data || !data.content) {
      console.error("No content received from edge function:", data);
      throw new Error("Intet indhold modtaget fra serveren");
    }

    console.log("Successfully received content from edge function, length:", data.content.length);
    
    // Sanitize the returned content to prevent XSS
    return DOMPurify.sanitize(data.content);
    
  } catch (error) {
    console.error("Error in generateCoverLetter:", error);
    
    // Handle network errors
    if (!navigator.onLine || (error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('connection') || 
         error.message.includes('offline')))) {
      throw new Error('Der opstod en netværksfejl. Kontroller din forbindelse og prøv igen.');
    }
    
    // Handle timeout errors
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new Error('Generering af ansøgning tog for lang tid. Prøv igen senere.');
    }
    
    // For other errors, use a generic message to avoid exposing details
    throw new Error("Der opstod en fejl ved generering af ansøgningen. Prøv igen senere.");
  }
};
