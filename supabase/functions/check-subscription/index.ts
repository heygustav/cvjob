
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request payload
    const { userId } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Checking subscription status for user: ${userId}`)

    // Check if user has any generations
    const { data: generationData, error: generationError } = await supabase
      .from('user_generations')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (generationError && generationError.code !== 'PGRST116') {
      console.error('Error checking user generation count:', generationError)
      throw generationError
    }

    // Number of free generations allowed
    const freeGenerationsAllowed = 1

    // Current count of generations used
    const freeGenerationsUsed = generationData?.count || 0

    // Check if user has an active subscription (mocked for now)
    // This would normally check a subscriptions table or call a payment provider API
    const hasActiveSubscription = false

    // Determine if user can generate
    const canGenerate = hasActiveSubscription || freeGenerationsUsed < freeGenerationsAllowed

    return new Response(JSON.stringify({
      canGenerate,
      freeGenerationsUsed,
      freeGenerationsAllowed,
      subscription: null // We'll add actual subscription data later
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
