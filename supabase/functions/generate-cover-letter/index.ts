
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
    
    const { jobInfo, userInfo } = requestData;
    console.log("Processing request for job:", jobInfo?.title || "Unknown job");

    if (!openAIApiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    // Construct a detailed prompt following the specified structure
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

    Skriv ansøgningen på dansk og hold den professionel, engagerende og overbevisende. Sørg for, at ansøgningen er grundig og detaljeret,
    med en optimal længde for en motiveret jobansøgning (typisk omkring 400-600 ord eller 1-1.5 A4-sider).

    VIGTIGT: Afslut IKKE ansøgningen med en hilsen eller et navn. Den endelige hilsen og underskrift vil blive tilføjet automatisk senere.`;

    try {
      console.log("Calling OpenAI API with GPT-4");
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using GPT-4 for better quality
          messages: [
            {
              role: 'system',
              content: 'Du er en ekspert i at skrive professionelle og overbevisende jobansøgninger på dansk. Du er særligt god til at tilpasse ansøgninger til specifikke stillinger og virksomheder, samt at fremhæve relevante kompetencer og erfaringer på en engagerende måde.'
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
