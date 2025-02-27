
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js";

// Configure CORS headers - more permissive for debugging
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': '*',
};

serve(async (req) => {
  // More verbose logging for debugging
  console.log("Function called with method:", req.method);
  console.log("Request headers:", Object.fromEntries(req.headers));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request (CORS preflight)");
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    console.log("Starting to process the request");
    
    // Parse the multipart form data
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      console.log("Form data parsed successfully, file found:", !!file);
      
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
      console.log("File type:", file.type);
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
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      console.log("Supabase URL available:", !!supabaseUrl);
      console.log("Supabase key available:", !!supabaseKey);
      
      const supabase = createClient(
        supabaseUrl ?? '',
        supabaseKey ?? ''
      );

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log("File converted to ArrayBuffer, size:", uint8Array.length);
      
      // Initialize PDF.js worker
      pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js";
      
      // Load PDF document
      console.log("Starting PDF parsing");
      const loadingTask = pdfjs.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;
      console.log("PDF document loaded, pages:", pdfDocument.numPages);
      
      // Extract text from all pages
      let extractedText = "";
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        console.log(`Processing page ${i} of ${pdfDocument.numPages}`);
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => 
          // @ts-ignore - textContent.items may have different structure
          item.str || item.text || ""
        ).join(" ");
        extractedText += pageText + "\n";
      }
      
      console.log("Extracted text from PDF, length:", extractedText.length);
      console.log("Sample of extracted text:", extractedText.substring(0, 200) + "...");

      // Use OpenAI to analyze the text
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      console.log("OpenAI API key available:", !!openAIApiKey);
      
      if (!openAIApiKey) {
        return new Response(
          JSON.stringify({ 
            error: "OpenAI API key not configured",
            message: "Please set the OPENAI_API_KEY in the Supabase Edge Function secrets"
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log("Sending text to OpenAI for analysis");
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
        return new Response(
          JSON.stringify({ 
            error: "Failed to analyze resume text", 
            details: errorData 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const analyzeResult = await analyzeResponse.json();
      console.log("Received response from OpenAI");
      
      const aiContent = analyzeResult.choices[0].message.content;
      
      // Parse the JSON response from OpenAI
      let extractedData;
      try {
        // Remove markdown formatting if present
        const cleanedContent = aiContent.replace(/```json\s*|\s*```/g, '');
        extractedData = JSON.parse(cleanedContent);
        console.log("Successfully parsed OpenAI response as JSON");
      } catch (e) {
        console.error("Failed to parse OpenAI response as JSON:", e);
        console.log("Raw response:", aiContent);
        
        // Try to extract JSON from a non-JSON response
        const jsonMatch = aiContent.match(/({[\s\S]*})/);
        if (jsonMatch) {
          try {
            extractedData = JSON.parse(jsonMatch[1]);
            console.log("Successfully parsed JSON from match");
          } catch (matchError) {
            console.error("Failed to parse matched JSON:", matchError);
            return new Response(
              JSON.stringify({ 
                error: "Failed to parse AI response", 
                raw_response: aiContent 
              }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
        } else {
          return new Response(
            JSON.stringify({ 
              error: "Failed to parse AI response", 
              raw_response: aiContent 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }

      console.log("Returning successful response with extracted data");
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
    } catch (formDataError) {
      console.error("Error parsing form data:", formDataError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse form data", 
          details: formDataError instanceof Error ? formDataError.message : String(formDataError)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An unknown error occurred",
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
