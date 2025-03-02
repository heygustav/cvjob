
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the user ID from the request
    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Call the database function to check if user can generate letter
    const { data, error } = await supabase.rpc('can_generate_letter', { user_id: userId })
    
    if (error) {
      throw error
    }
    
    // Get user's subscription status
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError)
      // Continue anyway as we might have free generations
    }
    
    // Get user's generation count
    const { data: generationCount, error: countError } = await supabase
      .from('user_generation_counts')
      .select('free_generations_used')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (countError) {
      console.error('Error fetching generation count:', countError)
      // Continue anyway
    }
    
    const freeGenerationsUsed = generationCount?.free_generations_used || 0
    const hasActiveSubscription = subscription?.status === 'active' && 
      (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date())
    
    return new Response(JSON.stringify({
      canGenerate: data,
      subscription: subscription || null,
      freeGenerationsUsed,
      hasActiveSubscription,
      freeGenerationsAllowed: 1
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error checking subscription:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
