
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionStatus, CheckoutOptions, PromoCodeValidation } from "./types";

// Check if a user can generate a cover letter
export const checkSubscriptionStatus = async (userId: string): Promise<SubscriptionStatus> => {
  try {
    console.log("Checking subscription status for user:", userId);
    const { data, error } = await supabase.functions.invoke('check-subscription', {
      body: { userId }
    });

    if (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
    
    console.log("Subscription status response:", data);
    return data;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    // Return a default status object instead of throwing
    return {
      canGenerate: false,
      subscription: null,
      freeGenerationsUsed: 0,
      freeGenerationsAllowed: 1
    };
  }
}

// Create a checkout session for subscription
export const createCheckoutSession = async (options: CheckoutOptions): Promise<{ url: string }> => {
  try {
    console.log("Creating checkout session with options:", {
      ...options,
      // Don't log userId for privacy
      userId: options.userId ? "[REDACTED]" : undefined
    });
    
    if (!options.userId) {
      throw new Error("User ID is required");
    }
    
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: options
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
    
    if (!data?.url) {
      console.error('No checkout URL returned:', data);
      throw new Error('Betalingssiden kunne ikke oprettes. Kontakt support.');
    }
    
    console.log("Checkout session created with URL:", data.url.substring(0, 60) + "...");
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Kunne ikke oprette betalingsside. Prøv igen senere.');
  }
}

// Increment user's generation count
export const incrementGenerationCount = async (userId: string): Promise<void> => {
  try {
    console.log("Incrementing generation count for user:", userId);
    const { error } = await supabase.functions.invoke('increment-generation-count', {
      body: { userId }
    });

    if (error) {
      console.error('Error incrementing generation count:', error);
      throw error;
    }
    
    console.log("Generation count incremented successfully");
  } catch (error) {
    console.error('Error incrementing generation count:', error);
    throw new Error('Kunne ikke registrere generering. Prøv igen senere.');
  }
}

// Validate a promo code
export const validatePromoCode = async (code: string): Promise<PromoCodeValidation> => {
  try {
    console.log("Validating promo code:", code);
    // Use a direct query instead of rpc since the rpc is not in the TypeScript types
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_until', new Date().toISOString())
      .maybeSingle();
    
    if (error) {
      console.error('Error validating promo code:', error);
      return { 
        isValid: false, 
        message: 'Der opstod en fejl ved validering af kampagnekoden' 
      };
    }
    
    console.log("Promo code validation result:", data);
    
    if (data) {
      // Check if max_uses is defined and if current uses has exceeded it
      if (data.max_uses !== null && data.current_uses >= data.max_uses) {
        return {
          isValid: false,
          message: 'Kampagnekoden er blevet anvendt for mange gange'
        };
      }
      
      return {
        isValid: true,
        discountPercent: data.discount_percent
      };
    }
    
    return { 
      isValid: false, 
      message: 'Ugyldig kampagnekode' 
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return { 
      isValid: false, 
      message: 'Der opstod en fejl ved validering af kampagnekoden' 
    };
  }
}

// Get Stripe customer portal URL
export const getCustomerPortalUrl = async (userId: string): Promise<{ url: string }> => {
  try {
    console.log("Getting customer portal URL for user:", userId);
    const { data, error } = await supabase.functions.invoke('get-customer-portal', {
      body: { userId }
    });

    if (error) {
      console.error('Error getting customer portal URL:', error);
      throw error;
    }
    
    if (!data?.url) {
      console.error('No customer portal URL returned:', data);
      throw new Error('Kunne ikke få adgang til kundeportalen. Kontakt support.');
    }
    
    console.log("Customer portal URL created");
    return data;
  } catch (error) {
    console.error('Error getting customer portal URL:', error);
    throw new Error('Kunne ikke få adgang til kundeportalen. Prøv igen senere.');
  }
}
