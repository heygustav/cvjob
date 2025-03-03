
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
    // Call the increment_user_generation_count function
    const { error } = await supabaseAdmin.rpc(
      'increment_user_generation_count',
      { user_id: userId }
    );

    if (error) {
      console.error('Error incrementing generation count:', error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error incrementing generation count:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
