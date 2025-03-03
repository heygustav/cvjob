
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.13.1'
import Stripe from 'https://esm.sh/stripe@12.7.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16',
  });

  // Get the signature from the header
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get the raw request body
  const body = await req.text();
  
  let event;
  try {
    // Verify the signature using the webhook secret
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return new Response(JSON.stringify({ error: `Webhook signature verification failed` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Initialize Supabase client with service role key for admin access
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  console.log(`Event type: ${event.type}`);

  try {
    // Handle specific Stripe events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.user_id;
        
        if (!userId) {
          throw new Error('User ID not found in session metadata');
        }

        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        // Get the payment method
        let paymentMethod = 'stripe';
        if (session.payment_method_types?.includes('mobilepay')) {
          paymentMethod = 'mobilepay';
        }

        // Insert/update subscription in database
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            payment_method: paymentMethod,
            // Get price from the first item
            plan_price: subscription.items.data[0].price.unit_amount / 100,
            currency: subscription.items.data[0].price.currency.toUpperCase()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error upserting subscription:', error);
          throw error;
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get user ID from subscription
        const { data: userData, error: userError } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (userError || !userData) {
          console.error('Error finding user for subscription:', userError);
          throw new Error('User not found for subscription');
        }

        // Update subscription in database
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            canceled_at: subscription.canceled_at 
              ? new Date(subscription.canceled_at * 1000).toISOString() 
              : null
          })
          .eq('user_id', userData.user_id);

        if (error) {
          console.error('Error updating subscription:', error);
          throw error;
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get user ID from subscription
        const { data: userData, error: userError } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();
        
        if (userError || !userData) {
          console.error('Error finding user for subscription:', userError);
          throw new Error('User not found for subscription');
        }

        // Update subscription status to canceled
        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date(subscription.canceled_at * 1000).toISOString()
          })
          .eq('user_id', userData.user_id);

        if (error) {
          console.error('Error canceling subscription:', error);
          throw error;
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Error processing webhook' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
})
