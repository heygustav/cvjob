
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
