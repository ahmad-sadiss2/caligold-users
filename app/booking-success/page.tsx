// app/booking-success/page.tsx - Enhanced with Payment Details
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import WhatsAppButton from "../../components/whatsapp-button";

interface BookingConfirmation {
  bookingReference: string;
  paymentIntentId: string;
  vehicle: {
    id: number;
    name: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    pricePerHour: number;
    passengerCapacity: number;
    selectedDuration: number;
    totalPrice: number;
  };
  bookingData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    pickupLocation: string;
    pickupDetails: string;
    dropoffLocation: string;
    dropoffDetails: string;
    serviceDate: string;
    pickupTime: string;
    serviceType: string;
    passengers: string;
    roundTrip: boolean;
  };
  totalPaid: number;
  bookingDate: string;
}

const BookingSuccessPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const [confirmationData, setConfirmationData] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    // Get booking confirmation data
    const storedConfirmation = sessionStorage.getItem('bookingConfirmation');
    if (storedConfirmation) {
      setConfirmationData(JSON.parse(storedConfirmation));
    }

    // Countdown timer to redirect to home
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="min-h-screen bg-black text-white flex items-center justify-center pt-16">
        
        {/* Success Section */}
        <section className="relative py-20 px-4 w-full">
          <div className="max-w-6xl mx-auto">
            {/* Success Icon and Header */}
            <div className="text-center mb-12">
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                  <motion.svg
                    className="w-16 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <path d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
                
                {/* Confetti-like particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-gold rounded-full"
                      initial={{ 
                        x: 64, 
                        y: 64, 
                        scale: 0,
                        opacity: 0 
                      }}
                      animate={{
                        x: 64 + (Math.random() - 0.5) * 200,
                        y: 64 + (Math.random() - 0.5) * 200,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.5 + Math.random() * 0.5,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-gold mb-6 drop-shadow-gold"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={1}
              >
                Payment Successful! 🎉
              </motion.h1>

              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-400 mx-auto rounded-full mb-8"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />

              <motion.p
                className="text-xl md:text-2xl text-white mb-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={2}
              >
                Your booking has been confirmed and paid!
              </motion.p>

              <motion.p
                className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                Thank you for choosing CALI GOLD DRIVE. Your payment has been processed securely, 
                and we'll be in touch shortly to finalize all details.
              </motion.p>
            </div>

            {/* Booking Details Grid */}
            {confirmationData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Payment Summary */}
                <motion.div
                  className="bg-gradient-to-br from-green-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
                    <span className="mr-2">💳</span>
                    Payment Confirmed
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount Paid:</span>
                      <span className="text-white font-bold">${confirmationData.totalPaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment ID:</span>
                      <span className="text-white font-mono text-xs">{confirmationData.paymentIntentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking Ref:</span>
                      <span className="text-white font-mono text-xs">{confirmationData.bookingReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-bold">✓ PAID</span>
                    </div>
                  </div>
                </motion.div>

                {/* Vehicle Details */}
                <motion.div
                  className="bg-gradient-to-br from-gold/20 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-gold/30"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                >
                  <h3 className="text-xl font-bold text-gold mb-4 flex items-center">
                    <span className="mr-2">🚗</span>
                    Your Vehicle
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Vehicle:</span>
                      <p className="text-white font-bold">{confirmationData.vehicle.name}</p>
                      <p className="text-gray-300">{confirmationData.vehicle.year} {confirmationData.vehicle.brand}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{confirmationData.vehicle.selectedDuration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Capacity:</span>
                      <span className="text-white">{confirmationData.vehicle.passengerCapacity} passengers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rate:</span>
                      <span className="text-white">${confirmationData.vehicle.pricePerHour}/hour</span>
                    </div>
                  </div>
                </motion.div>

                {/* Trip Details */}
                <motion.div
                  className="bg-gradient-to-br from-blue-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={6}
                >
                  <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                    <span className="mr-2">📍</span>
                    Trip Details
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">From:</span>
                      <p className="text-white">{confirmationData.bookingData.pickupLocation}</p>
                      {confirmationData.bookingData.pickupDetails && (
                        <p className="text-gray-300 text-xs">{confirmationData.bookingData.pickupDetails}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400">To:</span>
                      <p className="text-white">{confirmationData.bookingData.dropoffLocation}</p>
                      {confirmationData.bookingData.dropoffDetails && (
                        <p className="text-gray-300 text-xs">{confirmationData.bookingData.dropoffDetails}</p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{new Date(confirmationData.bookingData.serviceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{confirmationData.bookingData.pickupTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Passengers:</span>
                      <span className="text-white">{confirmationData.bookingData.passengers}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* What's Next Section */}
            <motion.div
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-gold/30"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={7}
            >
              <h3 className="text-2xl font-bold text-gold mb-6 text-center">What happens next?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h4 className="font-semibold text-white">1. Confirmation Email</h4>
                  <p className="text-gray-300 text-sm">
                    You'll receive a detailed booking confirmation email with your payment receipt within 5 minutes.
                  </p>
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📞</span>
                  </div>
                  <h4 className="font-semibold text-white">2. Personal Contact</h4>
                  <p className="text-gray-300 text-sm">
                    Our team will call or message you within 1 hour to confirm details and assign your driver.
                  </p>
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <h4 className="font-semibold text-white">3. Gold Experience</h4>
                  <p className="text-gray-300 text-sm">
                    Your driver will arrive on time with your premium vehicle ready for the ultimate gold experience.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="bg-black/50 rounded-xl p-6 mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={8}
            >
              <h3 className="text-xl font-bold text-gold mb-4 text-center">Need immediate assistance?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://wa.me/16575624945"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-all duration-300"
                >
                  <span>💬</span>
                  <span>WhatsApp Us</span>
                </a>
                
                <a
                  href="tel:6575624945"
                  className="flex items-center space-x-2 bg-gold hover:bg-yellow-400 text-black px-6 py-3 rounded-lg transition-all duration-300"
                >
                  <span>📞</span>
                  <span>Call (657) 562-4945</span>
                </a>

                <a
                  href={`mailto:support@caligolddrive.com?subject=Booking Confirmation - ${confirmationData?.bookingReference || 'Reference'}`}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-300"
                >
                  <span>📧</span>
                  <span>Email Us</span>
                </a>
              </div>
              
              {confirmationData && (
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">
                    Reference your booking ID: <span className="text-gold font-mono">{confirmationData.bookingReference}</span>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={9}
            >
              <Link
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-2xl"
              >
                Book Another Ride
              </Link>
              
              <Link
                href="/fleet"
                className="px-8 py-4 border-2 border-gold text-gold font-bold text-lg rounded-xl hover:bg-gold hover:text-black transition-all duration-300"
              >
                View Our Fleet
              </Link>

              <button
                onClick={() => window.print()}
                className="px-8 py-4 border-2 border-gray-600 text-gray-300 font-bold text-lg rounded-xl hover:bg-gray-600 hover:text-white transition-all duration-300"
              >
                📄 Print Receipt
              </button>
            </motion.div>

            {/* Auto-redirect notice */}
            <motion.div
              className="text-center"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={10}
            >
              <p className="text-gray-400 text-sm">
                Automatically redirecting to home page in{' '}
                <span className="text-gold font-bold">{countdown}</span> seconds
              </p>
              <button
                onClick={() => router.push('/')}
                className="text-gold hover:text-yellow-400 underline text-sm mt-2"
              >
                Go now
              </button>
            </motion.div>
          </div>

          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gold/30 rounded-full"
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 60 - 30, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BookingSuccessPage; 