
// Follow this Deno deployment checklist: https://deno.com/deploy/docs/deployctl
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Set up CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log("Resume extraction function called");
    
    // Get the PDF file from the request
    try {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        console.error("No file provided or invalid file");
        return new Response(
          JSON.stringify({ error: "No valid file provided" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

      // Read the PDF file content
      const fileBuffer = await file.arrayBuffer();
      
      // Extract text from PDF using an external API
      // We'll use OpenAI's API to help extract structured information from the PDF
      const apiKey = Deno.env.get("OPENAI_API_KEY");
      if (!apiKey) {
        console.error("Missing OpenAI API key");
        return new Response(
          JSON.stringify({ error: "Server configuration error" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Convert the PDF to base64 for the API request
      const base64File = btoa(
        new Uint8Array(fileBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      // Send the PDF to OpenAI for text extraction and analysis
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "system",
              content: "You are a PDF resume parser. Extract structured information from the resume. Return only a JSON object with fields for education, experience, and skills. Don't include any additional text or markdown formatting."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract the following information from this resume PDF: education history, work experience, and skills. Format the response as a JSON object with these fields."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:application/pdf;base64,${base64File}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1500,
          response_format: { type: "json_object" }
        }),
      });

      if (!openaiResponse.ok) {
        console.error("OpenAI API error:", await openaiResponse.text());
        return new Response(
          JSON.stringify({ error: "Error analyzing PDF content" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const openaiData = await openaiResponse.json();
      console.log("OpenAI response received");

      if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
        console.error("Unexpected API response format:", openaiData);
        return new Response(
          JSON.stringify({ error: "Invalid response from analysis service" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Parse the response content as JSON
      let extractedData;
      try {
        const responseContent = openaiData.choices[0].message.content;
        extractedData = JSON.parse(responseContent);
        console.log("Successfully parsed extracted data:", extractedData);
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        return new Response(
          JSON.stringify({ error: "Failed to parse analysis results" }),
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
    } catch (formError) {
      console.error("Error processing form data:", formError);
      return new Response(
        JSON.stringify({ error: "Error processing file upload: " + formError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred: " + error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
