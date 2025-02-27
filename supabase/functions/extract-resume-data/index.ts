
// Follow this Deno deployment checklist: https://deno.com/deploy/docs/deployctl
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

      // Convert PDF to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      // Create a prompt for OpenAI
      const systemPrompt = `
        You are a specialized CV/resume parser. Your task is to extract key information from the provided resume.
        Extract ONLY the following fields:
        - email: The person's email address if present
        - experience: A brief summary of work experience
        - education: A brief summary of education background
        - skills: A list of skills and competencies
        
        Important rules:
        - Return data in the original language of the resume (Danish, English, etc.)
        - If information is not found, use an empty string for that field
        - Extract information exactly as written - do not translate or modify
        - Do not include personal details like phone numbers or home addresses
        - Format your response as a valid JSON object with these fields ONLY
      `;

      // Call OpenAI API with simple error handling
      try {
        console.log("Sending PDF to OpenAI for analysis");
        
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
                    text: "Extract information from this CV/resume according to the guidelines.",
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
            temperature: 0.1,
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

        // Try to parse the JSON from the response
        let extractedData;
        try {
          // Look for a JSON object in the content
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            extractedData = JSON.parse(jsonMatch[0]);
          } else {
            extractedData = JSON.parse(content);
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
