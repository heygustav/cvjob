
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to generate-cover-letter function");
    
    // Parse request data
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      throw new Error("Invalid request format");
    }
    
    // Handle action=extract_job_info case (used by JobPostingForm)
    if (requestData.action === "extract_job_info") {
      console.log("Extracting job info from text");
      const text = requestData.text || "";
      
      // Extract info using simple regex patterns (this is a fallback method)
      const extractedInfo = {
        title: extractTitle(text),
        company: extractCompany(text),
        contact_person: extractContactPerson(text),
        url: extractUrl(text)
      };
      
      return new Response(JSON.stringify(extractedInfo), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle regular cover letter generation
    const { jobInfo, userInfo } = requestData;
    console.log("Processing request for job:", jobInfo?.title || "Unknown job");

    if (!openAIApiKey) {
      // If no API key, return a fallback response
      console.log("OpenAI API key not configured, using fallback response");
      const today = new Date().toLocaleDateString("da-DK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      
      const fallbackContent = `${today}\n\nKære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},\n\nJeg skriver for at ansøge om stillingen som ${jobInfo.title} hos ${jobInfo.company}.\n\nJeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.\n\nMed venlig hilsen,\n\n${userInfo.name || 'Dit navn'}${userInfo.phone ? '\nTlf: ' + userInfo.phone : ''}\n${userInfo.email}${userInfo.address ? '\n' + userInfo.address : ''}`;
      
      return new Response(JSON.stringify({ content: fallbackContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct a detailed prompt for OpenAI
    const prompt = `
    Som en professionel jobansøger, skriv en overbevisende og detaljeret ansøgning til stillingen som ${jobInfo.title || 'den annoncerede stilling'} hos ${jobInfo.company || 'virksomheden'},
    adresseret til ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'}. Brug følgende information om ansøgeren:

    Navn: ${userInfo.name || 'Ikke angivet'}
    Email: ${userInfo.email || 'Ikke angivet'}
    Telefon: ${userInfo.phone || 'Ikke angivet'}
    Adresse: ${userInfo.address || 'Ikke angivet'}
    Erfaring: ${userInfo.experience || 'Ikke angivet'}
    Uddannelse: ${userInfo.education || 'Ikke angivet'}
    Færdigheder: ${userInfo.skills || 'Ikke angivet'}

    Jobopslag:
    ${jobInfo.description || 'Ikke angivet'}

    Følg disse retningslinjer for at skrive ansøgningen:

    1. Start med en stærk og fængende indledning, der straks fanger læserens opmærksomhed.
    2. Brug konkrete og specifikke eksempler på færdigheder og resultater. Vær detaljeret og kvantificer præstationer hvor muligt.
    3. Forklar grundigt, hvorfor ansøgeren er interesseret i denne specifikke stilling.
    4. Uddyb hvordan kompetencerne matcher præcis det, som virksomheden/organisationen leder efter til stillingen. Brug specifikke eksempler.
    5. Beskriv hvordan ansøgerens personlige og professionelle værdier aligner med virksomhedens værdier og kultur.
    6. Afslut med en klar opfordring til handling og udtryk, at ansøgeren ser frem til muligheden for at uddybe ved en personlig samtale.
    7. Brug tidssvarende dansk, der viser personlighed og ikke lyder kunstigt (dog fortsat bevarer en lidt formel tone.)

    Skriv ansøgningen på dansk og hold den professionel, engagerende og overbevisende. Sørg for, at ansøgningen er grundig og detaljeret,
    med en optimal længde for en motiveret jobansøgning (typisk omkring 400-600 ord eller 1-1.5 A4-sider).

    VIGTIGT: Afslut IKKE ansøgningen med en hilsen eller et navn. Den endelige hilsen og underskrift vil blive tilføjet automatisk senere.`;

    try {
      console.log("Calling OpenAI API with GPT-4o-mini");
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using a more modern model
          messages: [
            {
              role: 'system',
              content: 'Du er en professionel jobansøger, der skriver overbevisende og detaljerede ansøgninger.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error (${response.status}):`, errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;

      // Format the final letter with date and signature
      const today = new Date().toLocaleDateString("da-DK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const finalLetter = `${today}

Kære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},

${generatedText}

Med venlig hilsen,

${userInfo.name || 'Dit navn'}${userInfo.title ? `\n${userInfo.title}` : ''}${userInfo.phone ? `\nTlf: ${userInfo.phone}` : ''}
${userInfo.email}${userInfo.address ? `\n${userInfo.address}` : ''}`;

      return new Response(JSON.stringify({ content: finalLetter }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error("Error in OpenAI request:", error);
      throw error;
    }
  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "Der opstod en fejl under generering af ansøgningen", 
        details: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions for text extraction
function extractTitle(text: string): string {
  const patterns = [
    /(?:stilling|job|rolle)(?:\s+som|\:)\s+["']?([^"'\n,\.]{3,50})["']?/i,
    /søger\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
}

function extractCompany(text: string): string {
  const patterns = [
    /(?:hos|ved|for|i)\s+["']?([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S))?["']?/i,
    /(?:virksomhed|firma)\s+["']?([^"'\n,\.]{2,40})["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
}

function extractContactPerson(text: string): string {
  const patterns = [
    /(?:kontakt|henvendelse til)\s+["']?([^"'\n,\.]{2,40})["']?/i,
    /(?:spørgsmål|information)(?:\s+til)?\s+["']?([^"'\n,\.]{2,40})["']?/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return "";
}

function extractUrl(text: string): string {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?/g;
  const urls = text.match(urlPattern);
  if (urls && urls.length > 0) {
    const jobUrl = urls[0];
    if (!jobUrl.startsWith('http')) {
      return 'https://' + jobUrl;
    }
    return jobUrl;
  }
  return "";
}
