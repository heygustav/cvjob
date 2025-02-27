
// Follow this Deno deployment checklist: https://deno.com/deploy/docs/deployctl
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createRequire } from "https://deno.land/std@0.177.0/node/module.ts";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

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
    // Check for OpenAI API key
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      console.error("OpenAI API key is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

      if (file.type !== "application/pdf") {
        console.error("File is not a PDF");
        return new Response(
          JSON.stringify({ error: "Only PDF files are supported" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log("Processing PDF file:", file.name);

      // Get the PDF data as buffer
      const fileBuffer = await file.arrayBuffer();
      
      // Extract text from PDF
      let pdfText;
      try {
        const pdfData = await pdfParse(new Uint8Array(fileBuffer));
        pdfText = pdfData.text;
        
        if (!pdfText || pdfText.trim().length === 0) {
          console.error("No text could be extracted from PDF");
          return new Response(
            JSON.stringify({ 
              error: "Could not extract any text from the PDF. The file might be scan-only or corrupted." 
            }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        console.log("Successfully extracted text from PDF, length:", pdfText.length);
        // Log the first 500 characters for debugging
        console.log("First 500 chars:", pdfText.substring(0, 500));
      } catch (pdfError) {
        console.error("Error extracting text from PDF:", pdfError);
        return new Response(
          JSON.stringify({ error: "Error extracting text from PDF" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Create a prompt for OpenAI with strong emphasis on preserving special characters
      const systemPrompt = `
        You are a specialized CV/resume parser designed for Nordic languages. Your task is to extract key information from the provided resume text.
        
        Extract ONLY the following fields:
        - email: The person's email address (only if clearly present)
        - experience: A brief summary of work experience
        - education: A brief summary of education background
        - skills: A list of skills and competencies
        
        EXTREMELY IMPORTANT RULES:
        - Use an EXTREMELY conservative approach - only extract information you are HIGHLY CONFIDENT about
        - If information is not 100% clear, use an empty string for that field
        - DO NOT INVENT or INFER any information - only extract what is explicitly stated
        - PRESERVE ALL SPECIAL CHARACTERS exactly as written, especially Nordic letters like "ø", "æ", and "å"
        - DO NOT normalize, transliterate, or modify special characters in any way
        - Return data in the EXACT original language of the resume (Danish, Norwegian, Swedish, etc.)
        - DO NOT include phone numbers or home addresses
        - Format your response ONLY as a valid JSON object with these fields
        - If a section is unclear or has low confidence, return an empty string for that field
        - Your entire response must be valid JSON with NO explanatory text before or after
      `;

      // Call OpenAI API with the extracted text
      try {
        console.log("Sending PDF text to OpenAI for analysis");
        
        const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAIKey}`,
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
                content: pdfText,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.0, // Absolute minimum temperature for most deterministic output
          }),
        });

        if (!openAIResponse.ok) {
          const errorText = await openAIResponse.text();
          console.error("OpenAI API error:", openAIResponse.status, errorText);
          throw new Error(`OpenAI API error: ${openAIResponse.status}`);
        }

        const openAIData = await openAIResponse.json();
        
        if (!openAIData.choices || !openAIData.choices[0] || !openAIData.choices[0].message) {
          console.error("Unexpected OpenAI response format", openAIData);
          throw new Error("Invalid response format from OpenAI");
        }

        const content = openAIData.choices[0].message.content;
        console.log("Raw OpenAI response:", content);

        // Parse the JSON response
        let extractedData;
        try {
          extractedData = JSON.parse(content);
          
          // Additional validation to ensure empty strings rather than null values
          for (const key of ['email', 'experience', 'education', 'skills']) {
            if (extractedData[key] === null || extractedData[key] === undefined) {
              extractedData[key] = '';
            }
          }
          
          console.log("Successfully parsed extracted data:", extractedData);
        } catch (parseError) {
          console.error("Error parsing JSON from OpenAI response:", parseError);
          throw new Error("Could not parse resume data from AI response");
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
      } catch (aiError) {
        console.error("Error during OpenAI processing:", aiError);
        return new Response(
          JSON.stringify({ error: "Error analyzing PDF: " + aiError.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } catch (formError) {
      console.error("Error processing form data:", formError);
      return new Response(
        JSON.stringify({ error: "Error processing file upload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
