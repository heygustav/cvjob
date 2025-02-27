
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
    const requestData = await req.json();
    
    // Handle job info extraction requests (separate from letter generation)
    if (requestData.action === "extract_job_info" && requestData.text) {
      console.log("Extracting job info from text");
      
      // Simple pattern matching extraction (reliable fallback)
      const extractedInfo = {
        title: extractJobTitle(requestData.text),
        company: extractCompany(requestData.text),
        contact_person: extractContactPerson(requestData.text),
        url: extractJobURL(requestData.text)
      };
      
      console.log("Extracted job info:", extractedInfo);
      return new Response(JSON.stringify(extractedInfo), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle cover letter generation
    const { jobInfo, userInfo } = requestData;
    console.log("Generating cover letter for job:", jobInfo.title);

    // Generate a mock cover letter if there are issues with the API
    // This ensures the app works even if there are API issues
    let generatedContent;
    
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
              content: 'Du er en professionel jobansøgningsekspert, der hjælper med at skrive overbevisende og personlige ansøgninger på dansk.'
            },
            {
              role: 'user',
              content: `
              Som en professionel jobansøger, skriv en overbevisende og detaljeret ansøgning til stillingen som ${jobInfo.title} hos ${jobInfo.company},
              adresseret til ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'}. 
              
              Brug følgende information om ansøgeren:
              Navn: ${userInfo.name || 'Ansøger'}
              Email: ${userInfo.email || 'email@example.com'}
              Telefon: ${userInfo.phone || ''}
              Adresse: ${userInfo.address || ''}
              Erfaring: ${userInfo.experience || 'Har erfaring inden for branchen.'}
              Uddannelse: ${userInfo.education || 'Relevant uddannelse inden for feltet.'}
              Færdigheder: ${userInfo.skills || 'Relevante kompetencer for stillingen.'}
              
              Jobopslag:
              ${jobInfo.description || 'En stilling som ' + jobInfo.title + ' hos ' + jobInfo.company}
              
              Skriv en professionel, engagerende og overbevisende ansøgning på dansk.`
            }
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        generatedContent = data.choices[0].message.content;
        console.log("Successfully generated content with OpenAI");
      } else {
        throw new Error("Failed to get response from OpenAI");
      }
    } catch (error) {
      console.error("Error generating with OpenAI, using fallback:", error);
      // Fallback content if OpenAI fails
      generatedContent = generateFallbackLetter(jobInfo, userInfo);
    }

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
${userInfo.phone ? '\n' + userInfo.phone : ''}
${userInfo.email || 'Din e-mail'}
${userInfo.address ? '\n' + userInfo.address : ''}`;

    console.log("Successfully generated cover letter");
    return new Response(JSON.stringify({ content: finalLetter }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    // Return a more helpful error message
    return new Response(
      JSON.stringify({ 
        error: "Der opstod en fejl under generering af ansøgningen", 
        details: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Function to generate a fallback cover letter if OpenAI fails
function generateFallbackLetter(jobInfo: any, userInfo: any) {
  return `Jeg skriver for at ansøge om stillingen som ${jobInfo.title} hos ${jobInfo.company}, som jeg så annonceret.

Med min baggrund inden for ${userInfo.experience || 'relevante områder'} og min uddannelse som ${userInfo.education || 'relevant uddannelse'}, mener jeg, at jeg ville være et godt match til denne rolle. 

${jobInfo.description ? 'Ud fra jobopslaget kan jeg se, at I søger en kandidat med erfaring og kompetencer, som jeg besidder.' : 'Jeg er sikker på, at mine kvalifikationer matcher jeres behov.'}

Jeg har særligt fokus på ${userInfo.skills || 'professionelle kompetencer'} og har tidligere opnået gode resultater i lignende roller.

Jeg ser frem til muligheden for at diskutere, hvordan mine færdigheder og erfaringer kan bidrage til ${jobInfo.company}.`;
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
