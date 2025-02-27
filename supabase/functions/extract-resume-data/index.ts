
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    // Get the OpenAI API key from environment variables
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
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

    console.log("Processing PDF file:", file.name, "Size:", file.size);

    // Convert PDF to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    console.log("PDF converted to base64, sending to OpenAI API");

    // Create a prompt for OpenAI
    const systemPrompt = `
      Extract resume information from the provided PDF document. Be precise and only extract what is clearly stated.
      Return ONLY a JSON object with these fields:
      - email: The person's email address
      - experience: A brief summary of work experience
      - education: A brief summary of education background
      - skills: A list of skills and competencies
      
      Important rules:
      - Do NOT include phone numbers or addresses
      - Do NOT modify names (keep any special characters like ø, æ, å intact)
      - If information is not found or unclear, use null for that field
      - Do NOT make up or infer information
      - Keep the original language from the resume
    `;

    // Call OpenAI API
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
            content: [
              {
                type: "text",
                text: "Extract the resume information from this PDF document according to the guidelines.",
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
        temperature: 0.1,  // Use a low temperature for more deterministic output
        max_tokens: 1500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorBody = await openAIResponse.text();
      console.error("OpenAI API Error:", openAIResponse.status, errorBody);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    // Parse the response from OpenAI
    const openAIResult = await openAIResponse.json();
    console.log("Received response from OpenAI");

    if (!openAIResult.choices || !openAIResult.choices[0] || !openAIResult.choices[0].message) {
      console.error("Unexpected OpenAI response format:", openAIResult);
      throw new Error("Unexpected response format from OpenAI");
    }

    const responseContent = openAIResult.choices[0].message.content;
    
    // Try to extract JSON from the response
    let extractedData;
    try {
      // Look for a JSON object in the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON object found, try to parse the entire content
        extractedData = JSON.parse(responseContent);
      }
      
      console.log("Successfully extracted data:", extractedData);
    } catch (parseError) {
      console.error("Failed to parse JSON from response:", parseError);
      console.log("Raw response content:", responseContent);
      throw new Error("Could not parse data from OpenAI response");
    }

    // Return the extracted data
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
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
