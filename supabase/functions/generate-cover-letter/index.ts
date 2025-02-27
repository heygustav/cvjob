
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobInfo, userInfo, jobPosting } = await req.json();

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

Kære ${jobInfo.contactPerson},

${generatedContent}

Med venlig hilsen,

${userInfo.name}
${userInfo.phone}
${userInfo.email}
${userInfo.address}`;

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
