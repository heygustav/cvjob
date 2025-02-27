
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
      return new Response(
        JSON.stringify({ error: "Invalid request format" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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
    
    if (!jobInfo || !userInfo) {
      return new Response(
        JSON.stringify({ error: "Missing job or user information" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log("Processing request for job:", jobInfo?.title || "Unknown job");

    // Always provide a fallback response, even if we'll try to use OpenAI
    const today = new Date().toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    
    const fallbackContent = `${today}\n\nKære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},\n\nJeg skriver for at ansøge om stillingen som ${jobInfo.title} hos ${jobInfo.company}.\n\nJeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.\n\nMed venlig hilsen,\n\n${userInfo.name || 'Dit navn'}${userInfo.phone ? '\nTlf: ' + userInfo.phone : ''}\n${userInfo.email}${userInfo.address ? '\n' + userInfo.address : ''}`;
    
    // If no API key, return the fallback response immediately
    if (!openAIApiKey) {
      console.log("OpenAI API key not configured, using fallback response");
      return new Response(JSON.stringify({ content: fallbackContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fallback timeout function - return after 8 seconds if OpenAI is too slow
    const timeoutId = setTimeout(() => {
      console.log("OpenAI request timed out, using fallback response");
      return new Response(JSON.stringify({ content: fallbackContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }, 8000);

    try {
      // Construct a prompt for OpenAI
      const prompt = `
      Som en professionel jobansøger, skriv en overbevisende ansøgning til stillingen som ${jobInfo.title || 'den annoncerede stilling'} hos ${jobInfo.company || 'virksomheden'},
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

      Skriv ansøgningen på dansk og hold den professionel og overbevisende. Underskriv ikke brevet, da underskriften tilføjes automatisk senere.`;

      console.log("Calling OpenAI API");
      
      // Use AbortController to help manage timeouts
      const controller = new AbortController();
      const timeoutPromise = setTimeout(() => controller.abort(), 7000);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Using a faster model to avoid timeouts
          messages: [
            {
              role: 'system',
              content: 'Du er en professionel jobansøger, der skriver overbevisende ansøgninger.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 1000, // Limiting tokens for faster response
        }),
      });

      clearTimeout(timeoutPromise);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error (${response.status}):`, errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;

      // Format the final letter
      const finalLetter = `${today}

Kære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},

${generatedText}

Med venlig hilsen,

${userInfo.name || 'Dit navn'}${userInfo.phone ? `\nTlf: ${userInfo.phone}` : ''}
${userInfo.email}${userInfo.address ? `\n${userInfo.address}` : ''}`;

      console.log("Successfully generated cover letter");
      return new Response(JSON.stringify({ content: finalLetter }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error("Error in OpenAI request:", error);
      console.log("Using fallback response due to OpenAI error");
      clearTimeout(timeoutId);
      
      // Return fallback content on error
      return new Response(JSON.stringify({ content: fallbackContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    
    // Return a generic fallback letter on any error
    const today = new Date().toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    
    const emergencyFallback = `${today}\n\nKære Rekrutteringsansvarlig,\n\nJeg skriver for at ansøge om den annoncerede stilling i jeres virksomhed.\n\nJeg mener, at mine kvalifikationer og erfaringer gør mig til et godt match for denne rolle, og jeg ser frem til muligheden for at bidrage til jeres team.\n\nMed venlig hilsen,\n\nDit navn`;
    
    return new Response(
      JSON.stringify({ 
        content: emergencyFallback,
        error: "Der opstod en fejl under generering af ansøgningen"
      }), {
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
