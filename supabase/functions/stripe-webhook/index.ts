
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import Stripe from 'https://esm.sh/stripe@12.6.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

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
    // Get the signature from the header
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing stripe-signature header', { 
        status: 400,
        headers: corsHeaders
      })
    }

    // Get the raw body
    const body = await req.text()
    
    // Construct the event
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    console.log(`Webhook received: ${event.type}`)

    // Handle the events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        
        // Get customer and subscription information
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          // Update subscription in database
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: session.client_reference_id,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              payment_method: session.payment_method_types[0],
              updated_at: new Date().toISOString()
            })
            
          if (error) {
            console.error('Error updating subscription:', error)
            throw error
          }
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // Update subscription in database
        const { data: existingSubscriptions, error: fetchError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .limit(1)
        
        if (fetchError) {
          console.error('Error fetching subscription:', fetchError)
          throw fetchError
        }
        
        if (existingSubscriptions && existingSubscriptions.length > 0) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
              canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
            })
            .eq('stripe_subscription_id', subscription.id)
            
          if (error) {
            console.error('Error updating subscription:', error)
            throw error
          }
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Update subscription status to canceled
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)
          
        if (error) {
          console.error('Error updating subscription:', error)
          throw error
        }
        break
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Webhook error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
