// app/api/stripe/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';

// CALI GOLD DRIVE - Live Stripe integration
const isTestMode = process.env.NEXT_PUBLIC_MOCK_PAYMENTS === 'true' || !process.env.STRIPE_SECRET_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', description, metadata } = await request.json();

    // Validate required fields
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      );
    }

    if (isTestMode) {
      // Mock Stripe response for testing
      console.log('🧪 MOCK MODE: Simulating Stripe Payment Intent Creation');
      console.log('Payment Details:', {
        amount,
        currency,
        description,
        metadata
      });

      // Generate a fake payment intent ID and client secret
      const mockPaymentIntentId = `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockClientSecret = `${mockPaymentIntentId}_secret_${Math.random().toString(36).substr(2, 16)}`;

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json({
        clientSecret: mockClientSecret,
        paymentIntentId: mockPaymentIntentId,
        message: '🧪 TEST MODE: Mock payment intent created successfully'
      });
    }

    // Real Stripe integration with live keys for CALI GOLD DRIVE
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
    });

    console.log('💳 LIVE MODE: Creating real Stripe payment intent for CALI GOLD DRIVE');

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer
      currency: currency.toLowerCase(),
      description: description || 'CALI GOLD DRIVE - Vehicle Booking',
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error('Stripe payment intent creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 