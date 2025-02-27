
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
    const requestData = await req.json();
    
    // Handle job info extraction requests (separate from letter generation)
    if (requestData.action === "extract_job_info" && requestData.text) {
      console.log("Extracting job info from text");
      return await extractJobInfo(requestData.text);
    }
    
    // Handle cover letter generation
    const { jobInfo, userInfo, jobPosting } = requestData;

    if (!openAIApiKey) {
      console.error("OpenAI API key is not set");
      return new Response(
        JSON.stringify({ error: "API key configuration error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
    Som en professionel jobansøger, skriv en overbevisende og detaljeret ansøgning til stillingen som ${jobInfo.title} hos ${jobInfo.company},
    adresseret til ${jobInfo.contactPerson}. Brug følgende information om ansøgeren:

    Navn: ${userInfo.name}
    Email: ${userInfo.email}
    Telefon: ${userInfo.phone}
    Adresse: ${userInfo.address}
    Erfaring: ${userInfo.experience}
    Uddannelse: ${userInfo.education}
    Færdigheder: ${userInfo.skills}

    Jobopslag:
    ${jobInfo.description}

    Følg disse retningslinjer for at skrive ansøgningen:

    1. Start med en stærk og fængende indledning, der straks fanger læserens opmærksomhed.
    2. Brug konkrete og specifikke eksempler på færdigheder og resultater. Vær detaljeret og kvantificer præstationer hvor muligt.
    3. Forklar grundigt, hvorfor ansøgeren er interesseret i denne specifikke stilling.
    4. Uddyb hvordan kompetencerne matcher præcis det, som virksomheden/organisationen leder efter til stillingen. Brug specifikke eksempler.
    5. Beskriv hvordan ansøgerens personlige og professionelle værdier aligner med virksomhedens værdier og kultur.
    6. Afslut med en klar opfordring til handling og udtryk, at ansøgeren ser frem til muligheden for at uddybe ved en personlig samtale.

    Skriv ansøgningen på dansk og hold den professionel, engagerende og overbevisende. Sørg for, at ansøgningen er grundig og detaljeret,
    med en optimal længde for en motiveret jobansøgning (typisk omkring 400-600 ord eller 1-1.5 A4-sider).

    VIGTIGT: Afslut IKKE ansøgningen med en hilsen eller et navn. Den endelige hilsen og underskrift vil blive tilføjet automatisk senere.`;

    console.log("Sending request to OpenAI");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Du er en professionel jobansøgningsekspert, der hjælper med at skrive overbevisende og personlige ansøgninger på dansk.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to generate cover letter", details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    const today = new Date();
    const formattedDate = today.toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Add the formal letter structure
    const finalLetter = `${formattedDate}

Kære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},

${generatedContent}

Med venlig hilsen,

${userInfo.name || 'Dit navn'}
${userInfo.phone || 'Dit telefonnummer'}
${userInfo.email || 'Din e-mail'}
${userInfo.address || 'Din adresse'}`;

    console.log("Successfully generated cover letter");
    return new Response(JSON.stringify({ content: finalLetter }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Function to extract job information from text using pattern matching
async function extractJobInfo(text: string) {
  console.log("Starting job info extraction");
  try {
    // Use OpenAI to extract job information if available
    if (openAIApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'Du er en AI assistent der er ekspert i at analysere og udtrække information fra jobannoncer på dansk. Du svarer kun med JSON-data, intet andet.'
              },
              {
                role: 'user',
                content: `
                Udled venligst følgende information fra denne jobannonce og returner resultatet i JSON-format:
                
                - title: Jobtitlen
                - company: Virksomhedens navn
                - contact_person: Kontaktperson (hvis nævnt)
                - url: Job-URL (hvis nævnt)
                
                Jobannonce:
                ${text}
                
                Returner kun JSON med disse felter. Hvis en information ikke findes, brug en tom string.
                `
              }
            ],
            temperature: 0.1, // Lower temperature for more precise extraction
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0].message.content;
          
          // Try to extract JSON from the response
          try {
            // Remove any markdown formatting if present
            const jsonStr = content.replace(/```json\n|\n```/g, '');
            const extracted = JSON.parse(jsonStr);
            
            console.log("Successfully extracted job info with OpenAI:", extracted);
            return new Response(JSON.stringify(extracted), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          } catch (jsonError) {
            console.error("Error parsing JSON from OpenAI response:", jsonError);
          }
        }
      } catch (aiError) {
        console.error("Error using OpenAI for extraction:", aiError);
      }
    }
    
    // Fallback to pattern matching if OpenAI fails or is not available
    const extractedInfo = {
      title: extractJobTitle(text),
      company: extractCompany(text),
      contact_person: extractContactPerson(text),
      url: extractJobURL(text)
    };
    
    console.log("Extracted job info with fallback patterns:", extractedInfo);
    return new Response(JSON.stringify(extractedInfo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in extractJobInfo:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Helper functions for text extraction
function extractJobTitle(text: string): string {
  const titlePatterns = [
    /(?:stilling(?:en)?|job(?:bet)?|rolle[nr]?|titel)(?::\s*|\s+er\s+|\s+som\s+|\s+)["']?([^"'\n,\.]{3,50})["']?/i,
    /søger\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?/i,
    /til\s+(?:en\s+)?["']?([^"'\n,\.]{3,50})["']?\s+(?:stilling|job)/i,
    /(?:^|\n)["']?([A-ZÆØÅa-zæøå][A-ZÆØÅa-zæøå\s]{2,30})["']?\s+(?:søges|stilling)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let title = match[1].trim();
      title = title.replace(/^(?:en|et|vores|som)\s+/i, '');
      return title;
    }
  }
  return "";
}

function extractCompany(text: string): string {
  const companyPatterns = [
    /(?:hos|ved|for|i|til)\s+["']?([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))?["']?/i,
    /(?:virksomhed(?:en)?|firma(?:et)?)\s+(?:er\s+)?["']?([^"'\n,\.]{2,40})["']?/i,
    /([^"'\n,\.]{2,40})(?:\s+(?:A\/S|ApS|I\/S|A\/B|K\/S|P\/S|IVS|SMBA|AMBA|FMBA))\s+søger/i,
  ];

  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let company = match[1].trim();
      return company;
    }
  }
  return "";
}

function extractContactPerson(text: string): string {
  const contactPatterns = [
    /(?:kontakt(?:person)?|henvendelse til|kontakt venligst)\s+["']?([^"'\n,\.]{2,40})["']?/i,
    /(?:spørgsmål|yderligere information)(?:\s+kan\s+rettes)?\s+til\s+["']?([^"'\n,\.]{2,40})["']?/i,
    /ansøgning(?:en)?\s+sendes\s+til\s+["']?([^"'\n,\.]{2,40})["']?/i,
  ];

  for (const pattern of contactPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let contact = match[1].trim();
      contact = contact.replace(/^(?:hr\.|hr|fru\.|frk\.|dr\.|prof\.)\s+/i, '');
      return contact;
    }
  }
  return "";
}

function extractJobURL(text: string): string {
  const urlPattern = /(?:(?:https?:)?\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?/g;
  const urls = text.match(urlPattern);
  if (urls && urls.length > 0) {
    const jobUrl = urls.find(url => 
      url.toLowerCase().includes('job') || 
      url.toLowerCase().includes('career') || 
      url.toLowerCase().includes('stilling')
    ) || urls[0];
    
    if (!jobUrl.startsWith('http')) {
      return 'https://' + jobUrl;
    }
    return jobUrl;
  }
  return "";
}
