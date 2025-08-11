"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import WhatsAppButton from "../../components/whatsapp-button";

const features = [
  {
    icon: "🐾",
    title: "100% Pet-Friendly",
    description: "No Extra Charges",
    detail: "Bring your beloved pets along at no extra charge. We understand they're part of the family. Ensure they are leashed or crated.",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80",
    benefits: ["No additional charges for pets", "Safe and comfortable for animals", "Professional pet-friendly drivers"]
  },
  {
    icon: "✈️",
    title: "Flight Delay Assurance",
    description: "Male & Female Drivers Available",
    detail: "We track your flight status and adjust pickup times accordingly, ensuring no extra fees for delays beyond your control.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    benefits: ["Real-time flight tracking", "No extra charges for delays", "Flexible pickup scheduling"]
  },
  {
    icon: "💳",
    title: "Flexible Payment Options",
    description: "Convenient & Secure",
    detail: "Pay conveniently with Zelle, Apple Pay, Venmo, Cash, or Card (on request). Full payment confirms your booking.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    benefits: ["Multiple payment methods", "Secure transactions", "Transparent pricing"]
  },
  {
    icon: "👥",
    title: "Driver Preference",
    description: "Your Comfort First",
    detail: "Request a female or male driver based on availability to ensure your utmost comfort and peace of mind during your journey.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    benefits: ["Choice of driver gender", "Professional chauffeurs", "Respectful service"]
  },
  {
    icon: "🛡️",
    title: "Safety & Privacy First",
    description: "Protected & Secure",
    detail: "Your safety and location are paramount. All drivers are vetted, respectful, and cameras may be installed inside vehicles for your safety and driver protection.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    benefits: ["Vetted professional drivers", "Vehicle safety cameras", "Privacy protection"]
  },
  {
    icon: "🏆",
    title: "Professional Conduct",
    description: "Gold Standard Service",
    detail: "Our drivers maintain strict professionalism, focusing solely on the ride experience and customer safety, ensuring a respectful environment for all passengers.",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
    benefits: ["Professional boundaries", "Respectful environment", "Focused on your comfort"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="min-h-screen bg-black text-white">
      <div className="w-full h-14 sm:h-16 bg-black" />
      {/* Hero Section */}
              <section className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80"
            alt="Why Choose CALI GOLD DRIVE"
            fill
            priority
            className="object-cover"
            onError={(e) => {
              // Why choose us background image failed to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
        </div>

        {/* Animated Gold Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold rounded-full opacity-30"
              animate={{
                y: [0, -80, 0],
                x: [0, Math.random() * 60 - 30, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gold drop-shadow-gold text-center mb-4 tracking-tight font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            Why Choose CALI GOLD DRIVE?
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-white text-center max-w-3xl mx-auto mb-6 font-light"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Experience the CALI GOLD DRIVE difference: where your needs and comfort come first.
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-400 rounded-full"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-gold/30 hover:border-gold/70 transition-all duration-500 shadow-xl"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                {/* Feature Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    priority={index === 0}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Feature image failed to load
                      e.currentTarget.src = "/assets/vehicles/vehicle-fallback.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Feature Icon */}
                  <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-black p-3 rounded-full text-2xl">
                    {feature.icon}
                  </div>
                </div>

                {/* Feature Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gold mb-2 group-hover:text-yellow-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white font-semibold mb-3">
                    {feature.description}
                  </p>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {feature.detail}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center text-gray-400 text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + i * 0.05, duration: 0.3 }}
                      >
                        <div className="w-2 h-2 bg-gold rounded-full mr-3 flex-shrink-0" />
                        {benefit}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={false}
                />

                {/* Animated Corner Accents */}
                <motion.div
                  className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/50"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/50"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.05 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border-2 border-gold/30 shadow-2xl relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold/20 to-transparent" />
            </div>

            {/* Gold Corner Decorations */}
            <span className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold rounded-tl-3xl" />
            <span className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold rounded-tr-3xl" />
            <span className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold rounded-bl-3xl" />
            <span className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold rounded-br-3xl" />

            <div className="relative z-10">
              <motion.div
                className="text-4xl mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                💎
              </motion.div>
              
              <motion.h2
                className="text-3xl md:text-4xl font-extrabold text-gold mb-6 drop-shadow-gold"
                variants={fadeInUp}
                custom={1}
              >
                Ready for a GOLD Standard Ride?
              </motion.h2>
              
              <motion.p
                className="text-xl text-gray-300 mb-8 leading-relaxed"
                variants={fadeInUp}
                custom={2}
              >
                Choose CALI GOLD DRIVE for your next journey and discover private transportation designed around you. We look forward to serving you!
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={fadeInUp}
                custom={3}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/"
                    className="px-8 py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-lg rounded-xl shadow-2xl hover:from-yellow-400 hover:to-gold transition-all duration-300"
                  >
                    Book Your Ride
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="px-8 py-4 border-2 border-gold text-gold font-bold text-lg rounded-xl hover:bg-gold hover:text-black transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400"
                variants={fadeInUp}
                custom={4}
              >
                <div className="flex items-center justify-center">
                  <span className="text-gold mr-2">📞</span>
                  Available 24/7
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-gold mr-2">🚗</span>
                  All Vehicle Types
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-gold mr-2">💎</span>
                  Premium Service
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}