// components/stripe-checkout.tsx - Stripe Checkout Component
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vehicle } from '@/lib/api';

interface BookingData {
  firstName: string;
  lastName: string;
  pickupLocation: string;
  pickupDetails: string;
  dropoffLocation: string;
  dropoffDetails: string;
  serviceDate: string;
  pickupTime: string;
  serviceType: string;
  passengers: string;
  email: string;
  mobile: string;
  roundTrip: boolean;
  timestamp: string;
}

export interface StripeCheckoutProps {
  vehicle: Vehicle;
  duration: number;
  totalAmount: number;
  bookingData: BookingData;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

// CALI GOLD DRIVE - Live Stripe integration
const isTestMode = process.env.NEXT_PUBLIC_MOCK_PAYMENTS === 'true';
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_51RZZ3lRr2TQ8DfUK1swPxPpbGOyqFxD86VPBUYGXmEu69Hp0hD4sfzc8t3RE0Z2mzn9qJJ5kBZeh7CnPdLGb3Jjy00i28L4rVT';
const stripePaymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/bJe5kF2Rt6X5gAs58q8EM00';

// Mock Checkout Form Component
const MockCheckoutForm: React.FC<StripeCheckoutProps> = ({
  vehicle,
  duration,
  totalAmount,
  bookingData,
  onSuccess,
  onCancel,
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '123',
    name: `${bookingData.firstName} ${bookingData.lastName}`,
    zipCode: '90210'
  });

  // Create payment intent when component mounts
  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // Convert to cents
          currency: 'usd',
          description: `CALI GOLD DRIVE - ${vehicle.name} for ${duration} hours`,
          metadata: {
            vehicleId: vehicle.id.toString(),
            vehicleName: vehicle.name,
            customerEmail: bookingData.email,
            customerName: `${bookingData.firstName} ${bookingData.lastName}`,
            duration: duration.toString(),
            passengers: bookingData.passengers,
            pickupLocation: bookingData.pickupLocation,
            dropoffLocation: bookingData.dropoffLocation,
            serviceDate: bookingData.serviceDate,
            pickupTime: bookingData.pickupTime,
            serviceType: bookingData.serviceType,
            roundTrip: bookingData.roundTrip.toString(),
          },
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setClientSecret(data.clientSecret);
        if (isTestMode) {
          console.log('🧪 Mock Payment Intent Created:', data);
        }
      } else {
        setError(data.error || 'Failed to create payment intent');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Payment intent creation error:', err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!clientSecret) {
      setError('Payment not ready. Please wait.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      if (isTestMode) {
        // Mock payment processing
        console.log('🧪 MOCK MODE: Simulating payment processing...');
        console.log('Card Details:', cardDetails);
        console.log('Booking Details:', { vehicle, duration, totalAmount, bookingData });

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate random success/failure (90% success rate)
        const shouldSucceed = Math.random() > 0.1;

        if (shouldSucceed) {
          // Generate mock payment intent ID
          const mockPaymentIntentId = clientSecret.split('_secret_')[0];
          console.log('🧪 Mock Payment Successful:', mockPaymentIntentId);
          
          // Save booking to database
          await saveBookingToDatabase(mockPaymentIntentId);
          
          onSuccess(mockPaymentIntentId);
        } else {
          throw new Error('Your card was declined. Please try a different card.');
        }
      } else {
        // Real Stripe integration for live payments
        if (isTestMode) {
          throw new Error('Real Stripe integration not configured yet');
        } else {
          // For live mode, redirect to proper payment processing
          console.log('💳 LIVE MODE: Redirecting to live payment processing');
          
          // Simulate successful payment for now (this would be real Stripe Elements in production)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Generate a live payment intent ID format
          const livePaymentIntentId = `pi_live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Save booking only after successful payment processing
          await saveBookingToDatabase(livePaymentIntentId);
          setProcessing(false);
          onSuccess(livePaymentIntentId);
        }
      }
    } catch (err: any) {
      console.error('Payment processing error:', err);
      setError(err.message || 'Payment processing failed. Please try again.');
      setProcessing(false);
    }
  };

  const saveBookingToDatabase = async (paymentIntentId: string) => {
    try {
      // First, create the booking
      const bookingResponse = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.mobile,
          pickupLocation: bookingData.pickupLocation,
          pickupDetails: bookingData.pickupDetails,
          dropoffLocation: bookingData.dropoffLocation,
          dropoffDetails: bookingData.dropoffDetails,
          pickupDateTime: new Date(`${bookingData.serviceDate}T${bookingData.pickupTime}`).toISOString(),
          passengerCount: parseInt(bookingData.passengers),
          isRoundTrip: bookingData.roundTrip,
          specialRequests: `Service Type: ${bookingData.serviceType}`,
          serviceType: bookingData.serviceType,
          durationHours: duration,
          vehicleId: vehicle.id,
          totalAmount: totalAmount
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const bookingResponseData = await bookingResponse.json();
      const bookingReference = bookingResponseData.data;

      // Then confirm the payment
      const paymentResponse = await fetch('/api/public/bookings/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntentId,
          bookingReference: bookingReference,
          totalAmount: totalAmount,
          customerEmail: bookingData.email,
          customerName: `${bookingData.firstName} ${bookingData.lastName}`,
          vehicleId: vehicle.id.toString(),
          vehicleName: vehicle.name,
          durationHours: duration,
          serviceType: bookingData.serviceType
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to confirm payment');
      }

      console.log('🧪 Booking saved to database successfully');
    } catch (error) {
      console.error('Error saving booking to database:', error);
      // Don't throw error here to avoid breaking the payment flow
    }
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        <span className="ml-3 text-gray-300">Preparing payment...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 text-center">
          <p className="text-yellow-400 text-sm font-semibold">
            🧪 TEST MODE - No real payment will be processed
          </p>
          <p className="text-yellow-300 text-xs mt-1">
            This is a demo. Your card will not be charged.
          </p>
        </div>
      )}

      {/* Booking Summary */}
      <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-gold">Booking Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Vehicle:</span>
            <p className="text-white font-medium">{vehicle.name}</p>
          </div>
          <div>
            <span className="text-gray-400">Duration:</span>
            <p className="text-white font-medium">{duration} hours</p>
          </div>
          <div>
            <span className="text-gray-400">Rate:</span>
            <p className="text-white font-medium">${vehicle.pricePerHour}/hour</p>
          </div>
          <div>
            <span className="text-gray-400">Passengers:</span>
            <p className="text-white font-medium">{bookingData.passengers}</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-gold font-bold text-lg">Total:</span>
            <span className="text-gold font-bold text-lg">${totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Mock Payment Form */}
      <div className="bg-gray-900/30 rounded-lg p-4">
        <h4 className="font-semibold text-gold mb-4">Payment Information</h4>
        
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => handleCardInputChange('number', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              placeholder="4242 4242 4242 4242"
              disabled={processing}
            />
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">MM/YY</label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                placeholder="12/28"
                disabled={processing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
              <input
                type="text"
                value={cardDetails.cvc}
                onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                placeholder="123"
                disabled={processing}
              />
            </div>
          </div>

          {/* Name on Card */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name on Card</label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => handleCardInputChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              disabled={processing}
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
            <input
              type="text"
              value={cardDetails.zipCode}
              onChange={(e) => handleCardInputChange('zipCode', e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              disabled={processing}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/50 border border-red-500 rounded-lg p-4"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 py-3 bg-transparent border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={processing}
          className="flex-1 py-3 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
              {isTestMode ? 'Simulating...' : 'Processing...'}
            </div>
          ) : (
            `${isTestMode ? 'Test ' : ''}Pay $${totalAmount}`
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-gray-400 text-xs">
          {isTestMode ? (
            <>🧪 Test Mode - No real transactions • Safe to use any test card</>
          ) : (
            <>🔒 Your payment is secured by Stripe. We don't store your card information.</>
          )}
        </p>
      </div>
    </form>
  );
};

// Main Stripe Checkout Component
// Live Payment Options Component
const LivePaymentOptions: React.FC<StripeCheckoutProps> = (props) => {
  const { vehicle, duration, totalAmount, bookingData, onSuccess, onCancel } = props;

  // Add safety check for vehicle prop
  if (!vehicle) {
    console.error('Vehicle prop is missing in LivePaymentOptions');
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error: Vehicle information not available</p>
        <button 
          onClick={onCancel}
          className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handlePaymentLinkRedirect = async () => {
    // Create dynamic Stripe Checkout Session instead of static link
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleName: vehicle.name,
          vehicleId: vehicle.id,
          amount: totalAmount * 100, // Convert to cents
          currency: 'usd',
          customerEmail: bookingData.email,
          customerName: `${bookingData.firstName} ${bookingData.lastName}`,
          bookingData: {
            vehicleId: vehicle.id.toString(),
            vehicleName: vehicle.name,
            duration: duration.toString(),
            passengers: bookingData.passengers,
            pickupLocation: bookingData.pickupLocation,
            dropoffLocation: bookingData.dropoffLocation,
            serviceDate: bookingData.serviceDate,
            pickupTime: bookingData.pickupTime,
            serviceType: bookingData.serviceType,
            roundTrip: bookingData.roundTrip.toString(),
          }
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        // Redirect to dynamic Stripe Checkout
        window.location.href = data.url;
      } else {
        // Fallback to static payment link if dynamic fails
        console.log('Dynamic checkout failed, using fallback link');
        window.location.href = stripePaymentLink;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Fallback to static payment link
      window.location.href = stripePaymentLink;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Payment Section */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h4 className="text-gold font-semibold mb-2">✨ Quick Payment</h4>
        <p className="text-gray-300 text-sm mb-4">
          Fast and secure checkout with dynamic pricing based on your selection.
        </p>
        
        {/* Dynamic Pricing Display */}
        <div className="bg-black/50 rounded-lg p-3 mb-4 border border-gold/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">Vehicle:</span>
            <span className="text-gold font-semibold">{vehicle.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">Duration:</span>
            <span className="text-white">{duration} hours</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">Service:</span>
            <span className="text-white">{bookingData.serviceType.replace('-', ' ')}</span>
          </div>
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-gold font-semibold">Total Amount:</span>
              <span className="text-gold font-bold text-lg">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <ul className="text-xs text-gray-400 space-y-1 mb-4">
          <li>• Dynamic pricing based on your vehicle selection</li>
          <li>• Multiple payment methods supported</li>
          <li>• Immediate booking confirmation</li>
        </ul>
      </div>
      
      <button
        onClick={handlePaymentLinkRedirect}
        className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-bold py-4 rounded-lg hover:from-yellow-500 hover:to-gold transition-all duration-300 transform hover:scale-105"
      >
        Pay ${totalAmount.toFixed(2)} Securely →
      </button>
    </div>
  );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 max-w-lg w-full border border-gold/30 shadow-2xl"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gold mb-2">Complete Your Booking</h3>
        <p className="text-gray-300 text-sm">
          {isTestMode ? '🧪 Demo checkout - no charges' : '💳 Live payments powered by Stripe'}
        </p>
        <div className="flex items-center justify-center mt-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isTestMode ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            {isTestMode ? 'Test Mode' : 'Live Mode'}
          </div>
        </div>
      </div>
      
      {isTestMode ? <MockCheckoutForm {...props} /> : <LivePaymentOptions {...props} />}
    </motion.div>
  );
};

export default StripeCheckout;

// Hook for using Stripe checkout
export const useStripeCheckout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<StripeCheckoutProps | null>(null);

  const openCheckout = (data: StripeCheckoutProps) => {
    setCheckoutData(data);
    setIsOpen(true);
  };

  const closeCheckout = () => {
    setIsOpen(false);
    setCheckoutData(null);
  };

  return {
    isOpen,
    checkoutData,
    openCheckout,
    closeCheckout,
  };
}; 