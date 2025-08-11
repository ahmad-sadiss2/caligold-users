// app/select-vehicle/page.tsx - Updated with Real Stripe Integration
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import WhatsAppButton from "../../components/whatsapp-button";
import StripeCheckout from "../../components/stripe-checkout";
import { api, Vehicle } from "../../lib/api";
import { getImageUrl } from "../../lib/utils";

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

interface SelectedVehicle extends Vehicle {
  selectedDuration: number;
  totalPrice: number;
}

const VehicleSelectionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passengers = searchParams.get('passengers') || '1';
  
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectedVehicle | null>(null);
  const [duration, setDuration] = useState(4); // Default 4 hours
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Get booking data from sessionStorage
    const storedBookingData = sessionStorage.getItem('pendingBooking');
    if (!storedBookingData) {
      router.push('/');
      return;
    }

    const data = JSON.parse(storedBookingData);
    setBookingData(data);
    
    // Check if booking data is not too old (24 hours)
    const bookingTime = new Date(data.timestamp);
    const now = new Date();
    const hoursDifference = (now.getTime() - bookingTime.getTime()) / (1000 * 3600);
    
    if (hoursDifference > 24) {
      sessionStorage.removeItem('pendingBooking');
      router.push('/');
      return;
    }

    fetchVehicles();
  }, [router]);

  useEffect(() => {
    if (vehicles.length > 0 && passengers) {
      const passengerCount = parseInt(passengers);
      const filtered = vehicles.filter(vehicle => 
        vehicle.isAvailable && vehicle.passengerCapacity >= passengerCount
      );
      setFilteredVehicles(filtered);
    }
  }, [vehicles, passengers]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.vehicles.getAll(0, 50);
      setVehicles(response.content);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (vehicle: Vehicle, hours: number) => {
    return vehicle.pricePerHour * hours;
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    const totalPrice = calculatePrice(vehicle, duration);
    setSelectedVehicle({
      ...vehicle,
      selectedDuration: duration,
      totalPrice
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!selectedVehicle || !bookingData) return;

    setProcessing(true);
    
    try {
      // Create the booking request with payment confirmation
      const bookingRequest = {
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.mobile,
        pickupLocation: `${bookingData.pickupLocation}${bookingData.pickupDetails ? ` - ${bookingData.pickupDetails}` : ''}`,
        dropoffLocation: `${bookingData.dropoffLocation}${bookingData.dropoffDetails ? ` - ${bookingData.dropoffDetails}` : ''}`,
        pickupDateTime: new Date(`${bookingData.serviceDate}T${bookingData.pickupTime}`).toISOString(),
        passengerCount: parseInt(bookingData.passengers),
        isRoundTrip: bookingData.roundTrip,
        specialRequests: `PAID BOOKING - Payment ID: ${paymentIntentId}\nVehicle: ${selectedVehicle.name} (ID: ${selectedVehicle.id})\nDuration: ${selectedVehicle.selectedDuration} hours\nTotal Paid: $${selectedVehicle.totalPrice}\nService Type: ${bookingData.serviceType}\nPassengers: ${bookingData.passengers}\nPickup Details: ${bookingData.pickupDetails || 'None'}\nDrop-off Details: ${bookingData.dropoffDetails || 'None'}`
      };

      // Submit booking to API
      const response = await api.booking.submit(bookingRequest);
      
      // Store booking confirmation data
      const confirmationData = {
        bookingReference: response.data || paymentIntentId,
        paymentIntentId,
        vehicle: selectedVehicle,
        bookingData,
        totalPaid: selectedVehicle.totalPrice,
        bookingDate: new Date().toISOString()
      };
      
      sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));
      
      // Clear pending booking data
      sessionStorage.removeItem('pendingBooking');
      
      // Redirect to success page
      router.push('/booking-success');
      
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Booking submission failed. Your payment was processed, but we need to manually confirm your booking. Please contact us immediately with your payment ID: ' + paymentIntentId);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedVehicle(null);
  };



  const handleEditBooking = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-xl text-gray-300">Loading available vehicles...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <p className="text-xl text-red-400 mb-4">{error || 'Booking data not found'}</p>
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Select Your Vehicle
            </motion.h1>
            <motion.p
              className="text-lg text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Available vehicles for {passengers} {parseInt(passengers) === 1 ? 'passenger' : 'passengers'}
            </motion.p>
            
            {/* Booking Summary */}
            <motion.div
              className="bg-gray-900/50 rounded-xl p-6 max-w-4xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">From:</span>
                  <p className="text-white font-medium">{bookingData.pickupLocation}</p>
                  {bookingData.pickupDetails && (
                    <p className="text-gray-300 text-xs">{bookingData.pickupDetails}</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-400">To:</span>
                  <p className="text-white font-medium">{bookingData.dropoffLocation}</p>
                  {bookingData.dropoffDetails && (
                    <p className="text-gray-300 text-xs">{bookingData.dropoffDetails}</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-400">Date & Time:</span>
                  <p className="text-white font-medium">
                    {new Date(bookingData.serviceDate).toLocaleDateString()} at {bookingData.pickupTime}
                  </p>
                  <button
                    onClick={handleEditBooking}
                    className="text-gold hover:text-yellow-400 text-xs mt-1 underline"
                  >
                    Edit booking details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Duration Selector */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gold mb-4">How long will you need the vehicle?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[2, 4, 6, 8, 12, 24].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setDuration(hours)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    duration === hours
                      ? 'bg-gold text-black'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {hours} {hours === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Vehicle Grid */}
          {filteredVehicles.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xl text-gray-300 mb-4">
                No vehicles available for {passengers} passengers
              </p>
              <p className="text-gray-400 mb-6">
                Please try reducing the number of passengers or contact us for custom arrangements
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Modify Booking
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gold/30 hover:border-gold/70 transition-all duration-300 shadow-xl"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(vehicle.imageUrl) || "/placeholder.jpg"}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    
                    {/* Capacity Badge */}
                    <div className="absolute top-4 left-4 bg-gold/90 text-black px-3 py-1 rounded-full text-sm font-bold">
                      👥 {vehicle.passengerCapacity} seats
                    </div>
                    
                    {/* Featured Badge */}
                    {vehicle.isFeatured && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gold mb-2">{vehicle.name}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
                    
                    {/* Vehicle Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-400">Year:</span>
                        <p className="text-white">{vehicle.year}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <p className="text-white">{vehicle.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Luggage:</span>
                        <p className="text-white">{vehicle.luggageCapacity}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Brand:</span>
                        <p className="text-white">{vehicle.brand}</p>
                      </div>
                    </div>

                    {/* Features */}
                    {vehicle.features && vehicle.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gold mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                          {vehicle.features.length > 3 && (
                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                              +{vehicle.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Hourly rate:</span>
                        <span className="text-white font-medium">${vehicle.pricePerHour}/hr</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Total for {duration} hours:</span>
                        <span className="text-2xl font-bold text-gold">
                          ${calculatePrice(vehicle, duration)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleVehicleSelect(vehicle)}
                        className="w-full py-3 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>💳</span>
                        <span>Book & Pay Securely</span>
                      </button>
                      
                      <p className="text-gray-400 text-xs text-center mt-2">
                        Powered by Stripe • Secure payment
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Stripe Payment Modal */}
        <AnimatePresence>
          {showPayment && selectedVehicle && bookingData && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StripeCheckout
                vehicle={selectedVehicle}
                duration={selectedVehicle.selectedDuration}
                totalAmount={selectedVehicle.totalPrice}
                bookingData={bookingData}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Processing Overlay */}
        <AnimatePresence>
          {processing && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-gray-900 rounded-2xl p-8 border border-gold/30 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gold mb-2">Processing Your Booking</h3>
                <p className="text-gray-300">Please wait while we confirm your reservation...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default VehicleSelectionPage; 