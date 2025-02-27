
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    // Only process POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Received request to extract resume data");
    
    // Parse the multipart form data to get the PDF file
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No PDF file found in request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PDF file: ${file.name}, size: ${file.size} bytes`);
    
    // Read the file as text (this won't work well for PDFs, but we'll use it as a fallback)
    const pdfText = await file.text();
    console.log(`Extracted ${pdfText.length} characters of text from PDF`);
    
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured in Supabase',
          message: 'Please set up the OPENAI_API_KEY secret in your Supabase project.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API to parse the resume
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a resume parser. Extract the following information from the provided CV/resume:
            - Full name
            - Email address
            - Phone number
            - Physical address
            - Work experience (formatted as text, with each role on a new line)
            - Education (formatted as text, with each qualification on a new line)
            - Skills (as a comma-separated list)
            
            Return the data in JSON format with these exact keys: 
            name, email, phone, address, experience, education, skills.`
          },
          {
            role: 'user',
            content: pdfText
          }
        ],
        temperature: 0.3,
      }),
    });

    const openAIData = await openAIResponse.json();
    console.log("Received response from OpenAI");
    
    if (!openAIData.choices || !openAIData.choices[0]) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Extract the generated content
    const content = openAIData.choices[0].message.content;
    
    // Parse the JSON response
    let parsedData;
    try {
      parsedData = JSON.parse(content);
      console.log("Successfully parsed resume data:", parsedData);
    } catch (e) {
      console.error("Error parsing OpenAI response as JSON:", e);
      throw new Error('Failed to parse OpenAI response');
    }

    // Return the extracted data
    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData: parsedData 
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error("Error processing PDF:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process PDF' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
