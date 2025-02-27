
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
    console.log("Function called: extract-job-info");
    const requestBody = await req.json();
    const { jobDescription } = requestBody;

    if (!openAIApiKey) {
      console.error("OpenAI API key is not set");
      return new Response(JSON.stringify({ error: 'OpenAI API key is not set' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!jobDescription) {
      console.error("Missing job description in request");
      return new Response(JSON.stringify({ error: 'Missing job description' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Calling OpenAI with job description (${jobDescription.length} chars)`);
    
    try {
      // Call OpenAI API to extract job information
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} ${errorText}`);
        return new Response(JSON.stringify({ 
          error: `OpenAI API returned status ${response.status}`,
          details: errorText
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      console.log("Received response from OpenAI");
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid response format from OpenAI:", JSON.stringify(data));
        return new Response(JSON.stringify({ 
          error: 'Invalid response format from OpenAI',
          data: data
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const content = data.choices[0].message.content;
      let extractedData;
      
      try {
        extractedData = JSON.parse(content);
        console.log("Successfully extracted job information");
      } catch (e) {
        console.error("Failed to parse OpenAI response:", content);
        return new Response(JSON.stringify({ 
          error: 'Failed to parse JSON in OpenAI response',
          content: content
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log("Returning extracted data to client");
      return new Response(JSON.stringify(extractedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (openAiError) {
      console.error("Error in OpenAI API call:", openAiError);
      return new Response(JSON.stringify({ 
        error: `Error in OpenAI API call: ${openAiError.message}`,
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('General error in extract-job-info function:', error);
    return new Response(JSON.stringify({ error: `General error: ${error.message}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
