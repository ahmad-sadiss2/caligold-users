// lib/stripe.ts - Stripe Integration Setup
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration - Live keys for CALI GOLD DRIVE
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Types for Stripe payment
export interface PaymentData {
  amount: number; // in cents
  currency: string;
  description: string;
  metadata: {
    bookingId: string;
    vehicleId: string;
    customerEmail: string;
    customerName: string;
    duration: string;
    passengers: string;
  };
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata: Record<string, string>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Stripe API functions
export const stripeApi = {
  // Create payment intent
  createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    return response.json();
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId: string): Promise<{ success: boolean; paymentIntent: any }> => {
    const response = await fetch('/api/stripe/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm payment');
    }

    return response.json();
  },
};

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Convert from cents to dollars
};

export const calculateTotalAmount = (pricePerHour: number, duration: number): number => {
  // Convert to cents for Stripe
  return Math.round(pricePerHour * duration * 100);
};

// Stripe webhook signature verification
export const verifyStripeWebhook = (payload: string, signature: string): boolean => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return false;
  }

  try {
    // In a real implementation, you would use Stripe's SDK to verify the signature
    // const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return true;
  } catch (error) {
    console.error('Stripe webhook verification failed:', error);
    return false;
  }
};

// Payment link integration for CALI GOLD DRIVE
export const stripePaymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/bJe5kF2Rt6X5gAs58q8EM00';

// Quick payment redirect function
export const redirectToPaymentLink = (bookingData?: any) => {
  if (typeof window !== 'undefined') {
    // Add booking data as URL parameters if needed
    const baseUrl = stripePaymentLink;
    window.location.href = baseUrl;
  }
};

// Check if we're in production mode
export const isProductionMode = (): boolean => {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_MOCK_PAYMENTS !== 'true';
}; 