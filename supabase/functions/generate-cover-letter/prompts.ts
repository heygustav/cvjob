
/**
 * Creates a system prompt for the cover letter generation
 */
export function createSystemPrompt(): string {
  return `
Du er en professionel karrierevejleder, der specialiserer sig i at skrive personlige og effektive jobansøgninger på dansk.
Din opgave er at generere en overbevisende ansøgning baseret på følgende information.

Følg disse retningslinjer:
1. Brug en formel men personlig tone
2. Fremhæv ansøgerens relevante erfaringer og kompetencer
3. Relatér til virksomhedens behov og jobbets krav
4. Inkluder standardoplysninger som dato, indledning, afslutning og kontaktoplysninger
5. Vær konkret omkring, hvorfor ansøgeren er et godt match til stillingen
6. Hold længden på mellem 300-500 ord
7. Vær professionel, men undgå klichéer og tom floskelsnak
8. Læg vægt på ansøgerens motivation og hvorfor netop denne virksomhed og stilling er interessant`;
}

/**
 * Creates a user prompt for the cover letter generation with job and user info
 */
export function createUserPrompt(jobInfo: any, userInfo: any): string {
  return `
JOBTITEL: ${jobInfo.title}
VIRKSOMHED: ${jobInfo.company}
JOBBESKRIVELSE:
${jobInfo.description}

ANSØGERS INFORMATION:
Navn: ${userInfo.name}
Email: ${userInfo.email}
Telefon: ${userInfo.phone}
Adresse: ${userInfo.address}

ERFARING:
${userInfo.experience}

UDDANNELSE:
${userInfo.education}

KOMPETENCER:
${userInfo.skills}

KONTAKTPERSON: ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'}

Generer nu en komplet ansøgning på dansk til denne stilling baseret på ovenstående information.`;
}
