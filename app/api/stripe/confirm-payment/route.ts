// app/api/stripe/confirm-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

// CALI GOLD DRIVE - Live Stripe integration
const isTestMode = process.env.NEXT_PUBLIC_MOCK_PAYMENTS === 'true' || !process.env.STRIPE_SECRET_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    if (isTestMode) {
      // Mock Stripe payment confirmation for testing
      console.log('🧪 MOCK MODE: Simulating Stripe Payment Confirmation');
      console.log('Payment Intent ID:', paymentIntentId);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock successful payment response
      const mockPaymentIntent = {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 12000, // $120.00 in cents
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        description: 'CALI GOLD DRIVE - Test Booking',
        receipt_email: null,
        metadata: {
          bookingId: `booking_${Date.now()}`,
          vehicleId: 'test_vehicle_1',
          customerEmail: 'test@example.com',
          customerName: 'Test Customer'
        }
      };

      return NextResponse.json({
        success: true,
        message: '🧪 TEST MODE: Payment confirmed successfully',
        paymentIntent: mockPaymentIntent,
      });
    }

    // Real Stripe integration with live keys for CALI GOLD DRIVE
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    console.log('💳 LIVE MODE: Confirming payment for CALI GOLD DRIVE');

    // Retrieve payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      success: paymentIntent.status === 'succeeded',
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      },
    });

  } catch (error: any) {
    console.error('Stripe payment confirmation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    );
  }
} 