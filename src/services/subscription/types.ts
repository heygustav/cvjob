
export interface SubscriptionStatus {
  canGenerate: boolean;
  subscription: Subscription | null;
  freeGenerationsUsed: number;
  hasActiveSubscription: boolean;
  freeGenerationsAllowed: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | 'unpaid';
  current_period_start: string | null;
  current_period_end: string | null;
  payment_method: 'stripe' | 'mobilepay';
  plan_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
  canceled_at: string | null;
}

export interface CheckoutOptions {
  userId: string;
  promoCode?: string;
  returnUrl: string;
  cancelUrl: string;
  paymentMethod: 'stripe' | 'mobilepay';
}

export interface PromoCodeValidation {
  isValid: boolean;
  discountPercent?: number;
  message?: string;
}
