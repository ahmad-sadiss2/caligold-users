// Enhanced Hero Section with improved mobile responsiveness
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import UpdatedBookingFormInline from './BookingFormInline';

interface EnhancedHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const EnhancedHero: React.FC<EnhancedHeroProps> = ({ 
  title = "Your Ride. Your Way. Always Gold.",
  subtitle = "Premium ride service across Southern California",
  description = "Airport • Events • Errands • Pet Friendly – No Extra Fees"
}) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/heroes/hero-main-bg.jpg"
          alt="CALI GOLD DRIVE Hero"
          fill
          priority
          className="object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/80" />
      </div>

      {/* Animated Gold Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold rounded-full opacity-40"
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 80 - 40, 0],
              opacity: [0.1, 0.8, 0.1]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Side - Hero Text */}
          <motion.div
            variants={fadeInUp}
            className="text-left space-y-6 lg:space-y-8 order-2 xl:order-1"
          >
            {/* Logo */}
            <motion.div
              variants={fadeInUp}
              className="space-y-2 lg:space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gold drop-shadow-2xl tracking-tight leading-none">
                CALI GOLD
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gold drop-shadow-2xl tracking-tight leading-none -mt-2">
                DRIVE
              </h1>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              variants={fadeInUp}
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight"
            >
              Your Ride. Your Way. Always Gold.
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg lg:text-xl text-gray-300 font-light max-w-md"
            >
              Airport • Events • Errands • Pet Friendly – No Extra Fees
            </motion.p>

            {/* Key Features Icons */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-3 lg:gap-4 max-w-lg"
            >
              {[
                { icon: '🐾', text: 'Pet Friendly' },
                { icon: '✈️', text: 'Airport Rides' },
                { icon: '🚗', text: 'Luxury Fleet' },
                { icon: '💎', text: 'Gold Service' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-black/40 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-gold/20 hover:border-gold/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={floatingAnimation}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <div className="text-xl lg:text-2xl mb-1 lg:mb-2">{item.icon}</div>
                  <div className="text-white text-xs lg:text-sm font-medium">{item.text}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action Buttons - Hidden on mobile to save space */}
            <motion.div
              variants={fadeInUp}
              className="hidden sm:flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4"
            >
              <motion.a
                href="#booking"
                className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-base lg:text-lg rounded-xl hover:from-yellow-400 hover:to-gold transition-all duration-300 text-center shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.a>
              <motion.a
                href="https://wa.me/16575624945"
                className="px-6 lg:px-8 py-3 lg:py-4 bg-transparent border-2 border-gold text-gold font-bold text-base lg:text-lg rounded-xl hover:bg-gold hover:text-black transition-all duration-300 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                WhatsApp Us
              </motion.a>
            </motion.div>

            {/* Mobile-only quick action */}
            <motion.div
              variants={fadeInUp}
              className="sm:hidden flex justify-center pt-4"
            >
              <motion.a
                href="https://wa.me/16575624945"
                className="px-8 py-3 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📱 Quick Book via WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Side - Booking Form */}
          <motion.div
            variants={fadeInUp}
            className="w-full order-1 xl:order-2"
            id="booking"
          >
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-gold/30 shadow-2xl">
              {/* Form Header */}
              <div className="text-center mb-6 lg:mb-8">
                <motion.h3 
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-2 lg:mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Book Your Gold Experience
                </motion.h3>
                <motion.div 
                  className="w-16 h-1 bg-gradient-to-r from-gold to-yellow-400 mx-auto rounded-full mb-3 lg:mb-4"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />
                <motion.p 
                  className="text-gray-300 text-sm lg:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  Get instant pricing and availability
                </motion.p>
              </div>

              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <UpdatedBookingFormInline />
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 lg:mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              {[
                { icon: "⚡", title: "Instant", desc: "Response", detail: "Within minutes" },
                { icon: "🔒", title: "Secure", desc: "Booking", detail: "Protected info" },
                { icon: "💎", title: "Gold", desc: "Guarantee", detail: "Premium service" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="bg-black/60 backdrop-blur-sm rounded-xl p-2 sm:p-3 lg:p-4 border border-gold/20 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg sm:text-xl lg:text-2xl mb-1">{item.icon}</div>
                  <h4 className="text-gold font-semibold text-xs sm:text-sm leading-tight mb-1">
                    {item.title}
                  </h4>
                  <h4 className="text-gold font-semibold text-xs sm:text-sm leading-tight mb-1">
                    {item.desc}
                  </h4>
                  <p className="text-gray-400 text-xs hidden sm:block">{item.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-gold rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Mobile Bottom Bar - Quick Actions */}
      <motion.div
        className="sm:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gold/30 p-4 z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="flex space-x-3">
          <a
            href="tel:6575624945"
            className="flex-1 bg-gold text-black font-bold py-3 rounded-lg text-center hover:bg-yellow-400 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>📞</span>
            <span>Call</span>
          </a>
          <a
            href="https://wa.me/16575624945"
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg text-center hover:bg-green-500 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default EnhancedHero; 