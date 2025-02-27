
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js";

// Configure CORS headers
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
    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      return new Response(
        JSON.stringify({ error: 'Only PDF files are supported' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create client with supabaseKey with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Initialize PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js";
    
    // Load PDF document
    const loadingTask = pdfjs.getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;
    
    // Extract text from all pages
    let extractedText = "";
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => 
        // @ts-ignore - textContent.items may have different structure
        item.str || item.text || ""
      ).join(" ");
      extractedText += pageText + "\n";
    }
    
    console.log("Extracted text from PDF:", extractedText.substring(0, 500) + "...");

    // Use OpenAI to analyze the text
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const analyzeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an AI assistant that helps extract professional information from resumes. 
            Extract the following information in JSON format:
            - name: The person's full name
            - email: Their email address
            - phone: Their phone number
            - address: Their physical address
            - experience: A detailed description of their work experience
            - education: A detailed description of their educational background
            - skills: A comprehensive list of their professional skills and qualifications
            
            Return ONLY the JSON object with these fields, nothing else. If a field cannot be found, leave it as an empty string.`
          },
          {
            role: 'user',
            content: extractedText
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error("Failed to analyze resume text");
    }

    const analyzeResult = await analyzeResponse.json();
    const aiContent = analyzeResult.choices[0].message.content;
    
    // Parse the JSON response from OpenAI
    let extractedData;
    try {
      // Remove markdown formatting if present
      const cleanedContent = aiContent.replace(/```json\s*|\s*```/g, '');
      extractedData = JSON.parse(cleanedContent);
      console.log("Extracted data:", extractedData);
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON:", e);
      console.log("Raw response:", aiContent);
      
      // Try to extract JSON from a non-JSON response
      const jsonMatch = aiContent.match(/({[\s\S]*})/);
      if (jsonMatch) {
        try {
          extractedData = JSON.parse(jsonMatch[1]);
          console.log("Successfully parsed JSON from match:", extractedData);
        } catch (matchError) {
          console.error("Failed to parse matched JSON:", matchError);
          throw new Error("Failed to parse AI response");
        }
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
