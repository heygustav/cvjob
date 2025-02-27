
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { jobInfo, userInfo } = await req.json();

    // Basic validation
    if (!jobInfo || !jobInfo.description) {
      throw new Error('Missing job description');
    }

    // Generate a simple cover letter template
    const today = new Date().toLocaleDateString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const content = `${today}

Kære ${jobInfo.contactPerson || 'Rekrutteringsansvarlig'},

Jeg skriver for at ansøge om stillingen som ${jobInfo.title} hos ${jobInfo.company}.

Med baggrund i min erfaring inden for ${jobInfo.title.toLowerCase()} og min passion for branchen, er jeg overbevist om, at jeg kan bidrage betydeligt til ${jobInfo.company}.

${userInfo.experience ? `\nMin erfaring omfatter:\n${userInfo.experience}\n` : ''}
${userInfo.skills ? `\nMine relevante kompetencer inkluderer:\n${userInfo.skills}\n` : ''}
${userInfo.education ? `\nMin uddannelsesmæssige baggrund:\n${userInfo.education}\n` : ''}

Jeg ser frem til muligheden for at uddybe mine kvalifikationer ved en personlig samtale.

Med venlig hilsen,
${userInfo.name || 'Dit navn'}${userInfo.phone ? '\n' + userInfo.phone : ''}
${userInfo.email || 'Din e-mail'}${userInfo.address ? '\n' + userInfo.address : ''}`;

    return new Response(
      JSON.stringify({
        content: content,
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
