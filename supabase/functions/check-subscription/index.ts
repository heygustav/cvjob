
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.13.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { userId } = body;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Initialize Supabase client with service role key for admin access
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Check if user has an active subscription
    const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
      throw subscriptionError;
    }

    // Get user's generation count
    const { data: generationData, error: generationError } = await supabaseAdmin
      .from('user_generation_counts')
      .select('free_generations_used')
      .eq('user_id', userId)
      .maybeSingle();

    if (generationError) {
      console.error('Error fetching generation count:', generationError);
      throw generationError;
    }

    // Get free generations allowed
    const FREE_GENERATIONS_ALLOWED = 1;
    const freeGenerationsUsed = generationData?.free_generations_used || 0;

    // Determine if user can generate
    const canGenerate = 
      !!subscriptionData || // Has active subscription
      freeGenerationsUsed < FREE_GENERATIONS_ALLOWED; // Has free generations left

    // Prepare response
    const response = {
      canGenerate,
      subscription: subscriptionData || null,
      freeGenerationsUsed,
      freeGenerationsAllowed: FREE_GENERATIONS_ALLOWED
    };

    return new Response(JSON.stringify(response), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
