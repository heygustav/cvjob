
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
    const { jobDescription } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    if (!jobDescription) {
      throw new Error('Missing job description');
    }

    // Call OpenAI API to extract job information
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4', // Changed from gpt-4o to gpt-4
        messages: [
          { 
            role: 'system', 
            content: 'Du er en hjælpsom assistent, der er specialiseret i at analysere jobopslag. Din opgave er at uddrage følgende information fra et jobopslag: virksomhed, jobtitel, kontaktperson og URL (hvis tilgængelig). Svar kun med et JSON objekt med felterne: company, title, contact_person, og url.'
          },
          { 
            role: 'user', 
            content: `Ekstraher virksomhed, jobtitel og kontaktperson samt, hvis tilgængeligt, link ud fra dette jobopslag:\n\n${jobDescription}`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI');
    }
    
    const content = data.choices[0].message.content;
    let extractedData;
    
    try {
      extractedData = JSON.parse(content);
      console.log("Successfully extracted job information:", extractedData);
    } catch (e) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error('Failed to parse response from OpenAI');
    }

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in extract-job-info function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
