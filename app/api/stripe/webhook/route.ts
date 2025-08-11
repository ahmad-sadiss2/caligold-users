// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyStripeWebhook } from '@/lib/stripe';
import { sendBookingNotification, BookingEmailData } from '@/lib/email';

// CALI GOLD DRIVE - Live Stripe webhook integration
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyStripeWebhook(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('💳 CALI GOLD DRIVE: Payment succeeded:', paymentIntent.id);
        console.log('Payment metadata:', paymentIntent.metadata);
        
        // Save booking to database when payment succeeds
        await saveBookingFromPayment(paymentIntent);
        
        break;

      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💳 CALI GOLD DRIVE: Checkout session completed:', session.id);
        console.log('Session metadata:', session.metadata);
        
        // Save booking from checkout session (external Stripe checkout)
        await saveBookingFromCheckoutSession(session);
        
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('❌ CALI GOLD DRIVE: Payment failed:', failedPayment.id);
        console.log('Failure reason:', failedPayment.last_payment_error?.message);
        
        // Handle failed CALI GOLD DRIVE booking
        // 1. Mark booking as failed in database
        // 2. Send failure notification to customer
        // 3. Offer alternative payment methods
        
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Save booking to database when payment succeeds
async function saveBookingFromPayment(paymentIntent: any) {
  try {
    const metadata = paymentIntent.metadata;
    
    // Check if we have all required booking data
    if (!metadata.customerEmail || !metadata.vehicleId) {
      console.log('⚠️ Insufficient booking data in payment metadata');
      return;
    }

    console.log('💾 Saving booking from successful payment:', paymentIntent.id);

    // Create booking in database
    const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://45.32.74.216/api'}/public/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Customer information
        firstName: metadata.customerName?.split(' ')[0] || 'Customer',
        lastName: metadata.customerName?.split(' ').slice(1).join(' ') || '',
        email: metadata.customerEmail,
        phone: metadata.customerPhone || '',
        
        // Booking details
        pickupLocation: metadata.pickupLocation || '',
        pickupDetails: metadata.pickupDetails || '',
        dropoffLocation: metadata.dropoffLocation || '',
        dropoffDetails: metadata.dropoffDetails || '',
        pickupDateTime: metadata.serviceDate && metadata.pickupTime 
          ? new Date(`${metadata.serviceDate}T${metadata.pickupTime}`).toISOString()
          : new Date().toISOString(),
        passengerCount: parseInt(metadata.passengers || '1'),
        isRoundTrip: metadata.roundTrip === 'true',
        specialRequests: `Service Type: ${metadata.serviceType || 'standard'}`,
        serviceType: metadata.serviceType || 'standard',
        durationHours: parseInt(metadata.duration || '1'),
        
        // Vehicle and payment
        vehicleId: parseInt(metadata.vehicleId),
        totalAmount: paymentIntent.amount / 100, // Convert from cents
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'COMPLETED'
      }),
    });

    if (bookingResponse.ok) {
      const bookingData = await bookingResponse.json();
      console.log('✅ Booking saved successfully:', bookingData.data?.id);
      
      // Send email notification to CALI GOLD DRIVE team
      const emailData: BookingEmailData = {
        id: bookingData.data?.id,
        booking_reference: bookingData.data?.bookingReference || `CG-${Date.now()}`,
        customer_id: bookingData.data?.customerId,
        service_id: bookingData.data?.serviceId,
        vehicle_id: parseInt(metadata.vehicleId),
        customer_first_name: metadata.customerName?.split(' ')[0] || 'Customer',
        customer_last_name: metadata.customerName?.split(' ').slice(1).join(' ') || '',
        customer_email: metadata.customerEmail,
        customer_phone: metadata.customerPhone || '',
        pickup_location: metadata.pickupLocation || '',
        dropoff_location: metadata.dropoffLocation || '',
        pickup_datetime: metadata.serviceDate && metadata.pickupTime 
          ? new Date(`${metadata.serviceDate}T${metadata.pickupTime}`).toISOString()
          : new Date().toISOString(),
        return_datetime: undefined,
        passenger_count: parseInt(metadata.passengers || '1'),
        is_round_trip: metadata.roundTrip === 'true',
        special_requests: `Service Type: ${metadata.serviceType || 'standard'}`,
        estimated_price: paymentIntent.amount / 100,
        final_price: paymentIntent.amount / 100,
        status: 'CONFIRMED',
        payment_status: 'COMPLETED',
        driver_notes: '',
        admin_notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pickup_details: metadata.pickupDetails || '',
        dropoff_details: metadata.dropoffDetails || '',
        payment_intent_id: paymentIntent.id,
        service_type: metadata.serviceType || 'standard',
        duration_hours: parseInt(metadata.duration || '1'),
        vehicle_name: metadata.vehicleName
      };

      // Send email notification
      const emailSent = await sendBookingNotification(emailData);
      if (emailSent) {
        console.log('📧 Email notification sent successfully');
      } else {
        console.log('❌ Failed to send email notification');
      }
      
    } else {
      console.error('❌ Failed to save booking:', await bookingResponse.text());
    }

  } catch (error) {
    console.error('❌ Error saving booking from payment:', error);
  }
}

// Save booking from checkout session (external Stripe checkout)
async function saveBookingFromCheckoutSession(session: any) {
  try {
    const metadata = session.metadata;
    
    // Check if we have all required booking data
    if (!metadata.customerEmail || !metadata.vehicleId) {
      console.log('⚠️ Insufficient booking data in checkout session metadata');
      return;
    }

    console.log('💾 Saving booking from checkout session:', session.id);

    // Create booking in database
    const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://45.32.74.216/api'}/public/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Customer information
        firstName: metadata.customerName?.split(' ')[0] || 'Customer',
        lastName: metadata.customerName?.split(' ').slice(1).join(' ') || '',
        email: metadata.customerEmail,
        phone: metadata.customerPhone || '',
        
        // Booking details
        pickupLocation: metadata.pickupLocation || '',
        pickupDetails: metadata.pickupDetails || '',
        dropoffLocation: metadata.dropoffLocation || '',
        dropoffDetails: metadata.dropoffDetails || '',
        pickupDateTime: metadata.serviceDate && metadata.pickupTime 
          ? new Date(`${metadata.serviceDate}T${metadata.pickupTime}`).toISOString()
          : new Date().toISOString(),
        passengerCount: parseInt(metadata.passengers || '1'),
        isRoundTrip: metadata.roundTrip === 'true',
        specialRequests: `Service Type: ${metadata.serviceType || 'standard'}`,
        serviceType: metadata.serviceType || 'standard',
        durationHours: parseInt(metadata.duration || '1'),
        
        // Vehicle and payment
        vehicleId: parseInt(metadata.vehicleId),
        totalAmount: session.amount_total / 100, // Convert from cents
        paymentIntentId: session.payment_intent,
        paymentStatus: 'COMPLETED',
        stripeSessionId: session.id
      }),
    });

    if (bookingResponse.ok) {
      const bookingData = await bookingResponse.json();
      console.log('✅ Booking saved successfully from session:', bookingData.data?.id);
      
      // Send email notification to CALI GOLD DRIVE team
      const emailData: BookingEmailData = {
        id: bookingData.data?.id,
        booking_reference: bookingData.data?.bookingReference || `CG-${Date.now()}`,
        customer_id: bookingData.data?.customerId,
        service_id: bookingData.data?.serviceId,
        vehicle_id: parseInt(metadata.vehicleId),
        customer_first_name: metadata.customerName?.split(' ')[0] || 'Customer',
        customer_last_name: metadata.customerName?.split(' ').slice(1).join(' ') || '',
        customer_email: metadata.customerEmail,
        customer_phone: metadata.customerPhone || '',
        pickup_location: metadata.pickupLocation || '',
        dropoff_location: metadata.dropoffLocation || '',
        pickup_datetime: metadata.serviceDate && metadata.pickupTime 
          ? new Date(`${metadata.serviceDate}T${metadata.pickupTime}`).toISOString()
          : new Date().toISOString(),
        return_datetime: undefined,
        passenger_count: parseInt(metadata.passengers || '1'),
        is_round_trip: metadata.roundTrip === 'true',
        special_requests: `Service Type: ${metadata.serviceType || 'standard'}`,
        estimated_price: session.amount_total / 100,
        final_price: session.amount_total / 100,
        status: 'CONFIRMED',
        payment_status: 'COMPLETED',
        driver_notes: '',
        admin_notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pickup_details: metadata.pickupDetails || '',
        dropoff_details: metadata.dropoffDetails || '',
        payment_intent_id: session.payment_intent,
        service_type: metadata.serviceType || 'standard',
        duration_hours: parseInt(metadata.duration || '1'),
        vehicle_name: metadata.vehicleName
      };

      // Send email notification
      const emailSent = await sendBookingNotification(emailData);
      if (emailSent) {
        console.log('📧 Email notification sent successfully');
      } else {
        console.log('❌ Failed to send email notification');
      }
      
    } else {
      console.error('❌ Failed to save booking from session:', await bookingResponse.text());
    }

  } catch (error) {
    console.error('❌ Error saving booking from checkout session:', error);
  }
} 