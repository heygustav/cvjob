
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
    
    // Generate a guaranteed simple cover letter
    const generateSimpleLetter = (jobTitle, company, contactPerson, username, email, phone, address) => {
      const today = new Date().toLocaleDateString("da-DK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      
      return `${today}

Kære ${contactPerson || 'Rekrutteringsansvarlig'},

Jeg skriver for at ansøge om stillingen som ${jobTitle || 'den annoncerede stilling'} hos ${company || 'jeres virksomhed'}.

Med min baggrund og erfaring mener jeg, at jeg vil være et godt match til denne rolle. Jeg har fulgt ${company || 'jeres virksomhed'} gennem længere tid og er særligt interesseret i at blive en del af jeres team.

Jeg er sikker på, at mine kvalifikationer matcher jeres behov, og jeg ser frem til muligheden for at diskutere, hvordan jeg kan bidrage til ${company || 'jeres virksomhed'}.

I er velkomne til at kontakte mig for yderligere information eller for at arrangere et møde.

Med venlig hilsen,

${username || 'Dit navn'}
${phone ? '\n' + phone : ''}
${email || 'Din e-mail'}
${address ? '\n' + address : ''}`;
    };
    
    // Parse request data but catch any parsing errors
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      
      // Return a fallback letter for any parsing errors
      const fallbackLetter = generateSimpleLetter(
        "stillingen", "virksomheden", "Rekrutteringsansvarlig", 
        "Ansøger", "email@example.com", "", ""
      );
      
      return new Response(JSON.stringify({ content: fallbackLetter }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Extract job and user info, using empty objects as fallbacks
    const jobInfo = requestData.jobInfo || {};
    const userInfo = requestData.userInfo || {};
    
    console.log("Processing request for job:", jobInfo.title || "Unknown job");
    
    // Generate a simple fallback letter without using OpenAI
    const simpleLetter = generateSimpleLetter(
      jobInfo.title, 
      jobInfo.company, 
      jobInfo.contactPerson, 
      userInfo.name, 
      userInfo.email, 
      userInfo.phone, 
      userInfo.address
    );
    
    // Try to use OpenAI if the API key is available, otherwise use the simple letter
    let finalLetterContent = simpleLetter;
    
    if (openAIApiKey) {
      try {
        console.log("Attempting to generate with OpenAI");
        
        const prompt = `
        Skriv en professionel ansøgning til stillingen som ${jobInfo.title || 'en annonceret stilling'} hos ${jobInfo.company || 'en virksomhed'}.
        
        Brug følgende information:
        - Navn: ${userInfo.name || 'Ansøgeren'}
        - Email: ${userInfo.email || 'email@example.com'}
        - Telefon: ${userInfo.phone || 'ikke oplyst'}
        - Adresse: ${userInfo.address || 'ikke oplyst'}
        
        Jobbeskrivelse:
        ${jobInfo.description || `En stilling som ${jobInfo.title || 'medarbejder'} hos ${jobInfo.company || 'virksomheden'}`}
        
        Skriv en kort, professionel ansøgning på dansk på maksimalt 300-400 ord.`;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Du er en jobansøgningsekspert. Skriv på dansk.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
          }),
        });

        // If we got a successful response, parse it carefully
        if (response.ok) {
          const responseText = await response.text();
          try {
            const data = JSON.parse(responseText);
            
            if (data && data.choices && data.choices[0] && data.choices[0].message) {
              const generatedText = data.choices[0].message.content;
              if (generatedText && typeof generatedText === 'string' && generatedText.length > 100) {
                // Only use the OpenAI result if it seems valid
                console.log("Successfully generated content with OpenAI");
                
                const today = new Date().toLocaleDateString("da-DK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                
                finalLetterContent = `${today}

Kære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},

${generatedText}

Med venlig hilsen,

${userInfo.name || 'Dit navn'}
${userInfo.phone ? '\n' + userInfo.phone : ''}
${userInfo.email || 'Din e-mail'}
${userInfo.address ? '\n' + userInfo.address : ''}`;
              }
            }
          } catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
            // We'll use the simple letter in this case
          }
        }
      } catch (aiError) {
        console.error("Error with OpenAI, using simple letter:", aiError);
        // We'll use the simple letter in this case
      }
    }
    
    console.log("Successfully prepared cover letter");
    return new Response(JSON.stringify({ content: finalLetterContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected error in generate-cover-letter function:', error);
    
    // Return a guaranteed valid response even in case of errors
    const emergencyLetter = `${new Date().toLocaleDateString("da-DK")}

Kære Rekrutteringsansvarlige,

Jeg skriver angående den annoncerede stilling hos jeres virksomhed. Med min baggrund og erfaring mener jeg at være et godt match til denne rolle.

Jeg ser frem til at høre fra jer og diskutere min ansøgning nærmere.

Med venlig hilsen,

[Dit navn]
[Din e-mail]`;
    
    return new Response(JSON.stringify({ content: emergencyLetter }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
