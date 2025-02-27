
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const openAIKey = Deno.env.get("OPENAI_API_KEY") || "";

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    if (!openAIKey) {
      console.error("Missing OpenAI API key");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Read the FormData from the request
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "No file provided or invalid file format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      return new Response(
        JSON.stringify({ error: "Only PDF files are supported" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Received file:", file.name, "Size:", file.size);

    // Read the file content as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    console.log("File converted to base64");

    // Send the file to OpenAI for text extraction using GPT-4 Vision
    console.log("Sending to OpenAI for processing");
    
    // Prepare system prompt for GPT-4 Vision
    const systemPrompt = `
      You are an AI designed to extract structured resume information from a PDF.
      Analyze the provided resume PDF carefully and extract the following information if available:
      - name: The person's full name as it appears on the resume, preserving any special characters or diacritics
      - email: The person's email address
      - experience: A summary of their work experience (max 800 characters)
      - education: A summary of their educational background (max 600 characters)
      - skills: A summary of their professional skills and competencies (max 400 characters)
      
      IMPORTANT EXTRACTION RULES:
      - Do NOT make assumptions about information that isn't clearly visible in the document
      - Extract ONLY information that is explicitly stated in the document
      - For name, preserve all special characters (like æ, ø, å, ü, é)
      - ONLY include phone and address if they are EXPLICITLY and CLEARLY stated
      - If any fields cannot be found with high confidence, leave them empty
      - Do NOT translate content - keep it in its original language
      - Do NOT make up or infer missing information
      - Preserve formatting and language as it appears in the original document
      
      Return your response as a JSON object with these fields. For any field where information is not found or unclear, set it to null.
    `;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract the resume information from this PDF document. Be conservative - don't make assumptions and only extract what's clearly visible.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:application/pdf;base64,${base64}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.2, // Setting a low temperature for more accurate extraction
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", response.status, errorText);
        return new Response(
          JSON.stringify({ 
            error: `OpenAI API returned error ${response.status}: ${errorText.substring(0, 100)}...` 
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const result = await response.json();
      
      if (!result.choices || !result.choices[0]) {
        console.error("Unexpected response format from OpenAI:", result);
        return new Response(
          JSON.stringify({ error: "Unexpected response format from OpenAI" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log("Received response from OpenAI");

      // Parse the AI's JSON response
      let extractedData;
      try {
        // Extract JSON from the GPT response
        const content = result.choices[0].message.content;
        const jsonContentMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonContentMatch) {
          extractedData = JSON.parse(jsonContentMatch[0]);
          console.log("Successfully parsed extracted data");
        } else {
          console.error("Could not find valid JSON in response:", content);
          return new Response(
            JSON.stringify({ 
              error: "Could not find valid JSON in the AI response",
              rawResponse: content.substring(0, 200) + "..." // Include part of the raw response for debugging
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      } catch (error) {
        console.error("Error parsing JSON from GPT response:", error);
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse extracted data: " + error.message,
            rawResponse: result.choices[0].message.content.substring(0, 200) + "..."
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          extractedData,
          message: "Resume data extracted successfully",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (openAIError) {
      console.error("Error calling OpenAI API:", openAIError);
      return new Response(
        JSON.stringify({ 
          error: "Error processing CV with OpenAI: " + openAIError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("General error processing CV:", error);
    
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing the CV: " + error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
