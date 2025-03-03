
export interface SubscriptionStatus {
  canGenerate: boolean;
  subscription?: {
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
    current_period_end?: string;
    plan_price?: number;
    currency?: string;
    payment_method?: 'stripe' | 'mobilepay';
  };
  freeGenerationsUsed: number;
  freeGenerationsAllowed: number;
}

export interface CheckoutOptions {
  userId: string;
  returnUrl: string;
  cancelUrl: string;
  paymentMethod: 'stripe' | 'mobilepay';
  promoCode?: string;
}

export interface PromoCodeValidation {
  isValid: boolean;
  message?: string;
  discountPercent?: number;
}
