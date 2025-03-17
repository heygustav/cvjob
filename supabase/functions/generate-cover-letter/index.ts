
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import "https://deno.land/x/xhr@0.2.1/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { callOpenAI, createErrorResponse } from "../_shared/openai.ts";
import { createSystemPrompt, createUserPrompt } from "./prompts.ts";
import { validateRequestData, createLogPayload } from "./validation.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge function received request");
    const requestData = await req.json();
    
    // Log request data with truncated description
    const logPayload = createLogPayload(requestData);
    console.log("Request payload (truncated):", JSON.stringify(logPayload));
    
    // Validate request data
    const { jobInfo, userInfo } = validateRequestData(requestData);
    
    // Always use gpt-4 model, ignoring any model parameter from client
    const model = "gpt-4";

    console.log(`Generating cover letter for ${jobInfo.title} at ${jobInfo.company} using model: ${model}`);

    // Create prompts for OpenAI
    const systemPrompt = createSystemPrompt();
    const userPrompt = createUserPrompt(jobInfo, userInfo);

    console.log("Calling OpenAI API...");

    // Generate the cover letter content
    const content = await callOpenAI(systemPrompt, userPrompt, model);
    console.log(`Generated content length: ${content.length} characters`);

    // Format today's date according to locale
    const locale = requestData.locale || "da-DK";
    const today = new Date().toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    console.log("Cover letter generated successfully");
    
    // Return the generated content and date
    return new Response(
      JSON.stringify({
        content: content,
        date: today
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    return createErrorResponse(error);
  }
});
