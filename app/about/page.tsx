"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import WhatsAppButton from "../../components/whatsapp-button";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: "easeOut" as const,
    },
  }),
};

const policies = [
  {
    icon: "🚗",
    title: "Service Terms",
    content: `We provide private, non-shared rides across Southern California (Los Angeles, San Diego, Orange County, Riverside). Services include: airport transfers, errands, appointments, events, and pet-friendly rides. Vehicles include SUVs, Sedans, and Vans, based on availability and rider needs. We reserve the right to refuse service to anyone engaging in inappropriate or unsafe behavior.`,
    color: "from-blue-500/20 to-blue-600/10"
  },
  {
    icon: "🐾",
    title: "Pet Policy",
    content: `We are proudly pet-friendly. No additional charges for pets. Passengers are responsible for ensuring pets are leashed or crated during the ride.`,
    color: "from-green-500/20 to-green-600/10"
  },
  {
    icon: "👥",
    title: "Driver Preference",
    content: `Riders may request female or male drivers based on availability. We respect your comfort and privacy at all times.`,
    color: "from-purple-500/20 to-purple-600/10"
  },
  {
    icon: "💳",
    title: "Payment Policy",
    content: `Full payment is required at the time of booking. No payment = No reservation. If payment is not completed, your booking will not be confirmed. Accepted payment methods: Zelle, Apple Pay, Venmo, Cash, or Card (upon request).`,
    color: "from-yellow-500/20 to-yellow-600/10"
  },
  {
    icon: "❌",
    title: "Cancellation & No-Show Policy",
    content: `Cancellations made 24+ hours in advance are free. Cancellations within less than 24 hours may be charged partially or fully. No-shows may result in 100% fare charge.`,
    color: "from-red-500/20 to-red-600/10"
  },
  {
    icon: "✈️",
    title: "Flight Delays",
    content: `We track your flight status. No extra charges for delays out of your control. Please communicate updated flight info to ensure timely pickup.`,
    color: "from-indigo-500/20 to-indigo-600/10"
  },
  {
    icon: "🔒",
    title: "Privacy & Safety",
    content: `Your personal info and location are never shared or sold. All drivers are vetted, respectful, and trained for safe transport. Cameras may be installed inside vehicles for your safety and driver protection.`,
    color: "from-teal-500/20 to-teal-600/10"
  },
  {
    icon: "🎯",
    title: "Driver Conduct Policy",
    content: `Drivers are not allowed to ask, answer, or engage in any personal questions with clients. They are expected to maintain professionalism and focus solely on the ride experience and customer safety. This is to ensure privacy, comfort, and a respectful environment for all passengers.`,
    color: "from-orange-500/20 to-orange-600/10"
  },
];

const stats = [
  { number: "100%", label: "Customer Satisfaction", icon: "⭐" },
  { number: "24/7", label: "Available Service", icon: "🕐" },
  { number: "4", label: "Counties Served", icon: "🌍" },
  { number: "0", label: "Hidden Fees", icon: "💎" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="min-h-screen bg-black text-white">
        <div className="w-full h-14 sm:h-16 bg-black" />
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/assets/general/about-page-team.jpg"
              alt="About CALI GOLD DRIVE"
              fill
              priority
              className="object-cover"
              onError={(e) => {
                                    // About hero background image failed to load
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
          </div>

          {/* Animated Gold Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gold rounded-full opacity-30"
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 80 - 40, 0],
                  opacity: [0.3, 0.9, 0.3]
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 4
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
              className="text-5xl md:text-7xl font-extrabold text-gold drop-shadow-gold text-center mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              About CALI GOLD DRIVE
            </motion.h1>
            <motion.p
              className="text-2xl md:text-3xl font-bold text-white text-center mb-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Your Ride. Your Way. Always GOLD.
            </motion.p>
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-gold to-yellow-400 rounded-full"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
          </div>
        </section>

        {/* Company Story Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-gold mb-6"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  Our Story
                </motion.h2>
                <motion.div
                  className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-400 mb-8 rounded-full"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                />
                
                <motion.p
                  className="text-xl text-gray-300 mb-6 leading-relaxed"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  CALI GOLD DRIVE was founded with a clear vision: to provide exceptional, private transportation services throughout Southern California. We believe in offering a personalized experience where your comfort, safety, and preferences are paramount.
                </motion.p>
                
                <motion.p
                  className="text-lg text-gray-400 mb-8 leading-relaxed"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  Whether you're heading to the airport, an important appointment, a special event, or simply running errands with your furry friend, CALI GOLD DRIVE is dedicated to making your journey seamless and comfortable. Privacy, reliability, and customer satisfaction is what sets us apart.
                </motion.p>

                {/* Key Values */}
                <motion.div
                  className="space-y-4"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  {[
                    "Serving LA, Orange County, San Diego & Riverside",
                    "Professional, vetted drivers with strict conduct policies",
                    "Clean, comfortable vehicles maintained to gold standards",
                    "24/7 booking availability with transparent pricing"
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <div className="w-3 h-3 bg-gold rounded-full mr-4 flex-shrink-0" />
                      <span className="text-white">{point}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Image & Stats */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-8 h-80">
                  <Image
                    src="/assets/general/about-page-team.jpg"
                    alt="CALI GOLD DRIVE Team"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // About page team image failed to load
                      e.currentTarget.style.display = 'none';
                      // Fallback to gradient if image fails
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-80 bg-gradient-to-br from-yellow-400/20 via-gray-800 to-black"></div><div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Floating Badge */}
                  <motion.div
                    className="absolute bottom-6 left-6 bg-gold text-black px-6 py-3 rounded-full font-bold shadow-xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Since 2023
                  </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-gold/30 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold text-gold mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Policies & Commitments Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6">
                Our Policies & Commitments
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-400 mx-auto rounded-full mb-6" />
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transparency and trust are the foundation of our service. Here's what you can expect when you choose CALI GOLD DRIVE.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {policies.map((policy, index) => (
                <motion.div
                  key={index}
                  className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gold/20 hover:border-gold/50 transition-all duration-300 overflow-hidden shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`h-2 bg-gradient-to-r ${policy.color}`} />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{policy.icon}</span>
                      <h3 className="text-xl font-bold text-gold group-hover:text-yellow-400 transition-colors">
                        {policy.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {policy.content}
                    </p>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border-2 border-gold shadow-2xl relative overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              {/* Gold Corner Decorations */}
              <span className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold rounded-tl-3xl" />
              <span className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold rounded-tr-3xl" />
              <span className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold rounded-bl-3xl" />
              <span className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gold rounded-br-3xl" />

              <div className="relative z-10">
                <motion.h2
                  className="text-3xl md:text-4xl font-extrabold text-gold mb-6 drop-shadow-gold"
                  variants={fadeInUp}
                  custom={1}
                >
                  Ready to Experience Gold-Level Service?
                </motion.h2>
                
                <motion.p
                  className="text-xl text-gray-300 mb-8 leading-relaxed"
                  variants={fadeInUp}
                  custom={2}
                >
                  Book your ride today and discover why our customers choose CALI GOLD DRIVE for all their transportation needs across Southern California.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                  variants={fadeInUp}
                  custom={3}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/"
                      className="px-10 py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-lg rounded-xl shadow-2xl hover:from-yellow-400 hover:to-gold transition-all duration-300"
                    >
                      Book Your Ride Now
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/contact"
                      className="px-10 py-4 border-2 border-gold text-gold font-bold text-lg rounded-xl hover:bg-gold hover:text-black transition-all duration-300"
                    >
                      Contact Us
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400"
                  variants={fadeInUp}
                  custom={4}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-gold mr-2">📞</span>
                    <a href="tel:6575624945" className="hover:text-gold transition-colors">
                      657-562-4945
                    </a>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-gold mr-2">💬</span>
                    <a href="https://wa.me/16575624945" className="hover:text-gold transition-colors">
                      WhatsApp
                    </a>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-gold mr-2">📷</span>
                    <a href="https://www.instagram.com/caligolddrivellc?igsh=MWM0MXkybnkxMzA2aw==" className="hover:text-gold transition-colors">
                      @caligolddrivellc
                    </a>
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