// app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

// CALI GOLD DRIVE - Dynamic Stripe Checkout Sessions
const isTestMode = process.env.NEXT_PUBLIC_MOCK_PAYMENTS === 'true' || !process.env.STRIPE_SECRET_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const { 
      vehicleName, 
      vehicleId, 
      amount, 
      currency = 'usd', 
      customerEmail, 
      customerName,
      bookingData 
    } = await request.json();

    // Validate required fields
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      );
    }

    if (!vehicleName || !customerEmail) {
      return NextResponse.json(
        { error: 'Vehicle name and customer email are required' },
        { status: 400 }
      );
    }

    if (isTestMode) {
      // Mock Stripe response for testing
      console.log('🧪 MOCK MODE: Simulating Dynamic Stripe Checkout Session');
      console.log('Dynamic checkout details:', {
        vehicleName,
        amount: amount / 100, // Convert back to dollars for display
        currency,
        customerEmail,
        bookingData
      });

      // Generate a fake checkout URL
      const mockCheckoutUrl = `https://checkout.stripe.com/pay/test_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      return NextResponse.json({
        url: mockCheckoutUrl,
        sessionId: `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: '🧪 TEST MODE: Mock dynamic checkout session created'
      });
    }

    // Real Stripe Checkout Session creation
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
    });

    console.log('💳 LIVE MODE: Creating dynamic Stripe checkout session for CALI GOLD DRIVE');
    console.log(`Vehicle: ${vehicleName}, Amount: $${(amount / 100).toFixed(2)}`);

    // Create dynamic checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `CALI GOLD DRIVE - ${vehicleName}`,
              description: `Luxury transportation service with ${vehicleName}`,
              images: [], // You can add vehicle images here later
            },
            unit_amount: Math.round(amount), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/fleet?cancelled=true`,
      customer_email: customerEmail,
      metadata: {
        // Store all booking details in metadata for webhook processing
        vehicleId: vehicleId?.toString() || '',
        vehicleName,
        customerEmail,
        customerName: customerName || '',
        customerPhone: bookingData.mobile || '',
        pickupLocation: bookingData.pickupLocation || '',
        pickupDetails: bookingData.pickupDetails || '',
        dropoffLocation: bookingData.dropoffLocation || '',
        dropoffDetails: bookingData.dropoffDetails || '',
        serviceDate: bookingData.serviceDate || '',
        pickupTime: bookingData.pickupTime || '',
        serviceType: bookingData.serviceType || '',
        passengers: bookingData.passengers || '1',
        roundTrip: bookingData.roundTrip || 'false',
        duration: bookingData.duration || '1'
      },
      payment_intent_data: {
        metadata: {
          // Also store in payment intent metadata for payment_intent.succeeded webhook
          vehicleId: vehicleId?.toString() || '',
          vehicleName,
          customerEmail,
          customerName: customerName || '',
          customerPhone: bookingData.mobile || '',
          pickupLocation: bookingData.pickupLocation || '',
          pickupDetails: bookingData.pickupDetails || '',
          dropoffLocation: bookingData.dropoffLocation || '',
          dropoffDetails: bookingData.dropoffDetails || '',
          serviceDate: bookingData.serviceDate || '',
          pickupTime: bookingData.pickupTime || '',
          serviceType: bookingData.serviceType || '',
          passengers: bookingData.passengers || '1',
          roundTrip: bookingData.roundTrip || 'false',
          duration: bookingData.duration || '1'
        }
      }
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error: any) {
    console.error('Stripe checkout session creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 