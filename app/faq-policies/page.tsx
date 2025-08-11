"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import WhatsAppButton from "../../components/whatsapp-button";
import { api, FAQ } from "../../lib/api";

const policies = [
  {
    title: "Service Terms",
    content: `We provide private, non-shared rides across Southern California (Los Angeles, San Diego, Orange County, Riverside). Services include: airport transfers, errands, appointments, events, and pet-friendly rides. Vehicles include SUVs, Sedans, and Vans, based on availability and rider needs. We reserve the right to refuse service to anyone engaging in inappropriate or unsafe behavior.`,
    icon: "🚗",
    color: "from-blue-500/20 to-blue-600/10"
  },
  {
    title: "Pet Policy",
    content: `We are proudly pet-friendly. No additional charges for pets. Passengers are responsible for ensuring pets are leashed or crated during the ride.`,
    icon: "🐾",
    color: "from-green-500/20 to-green-600/10"
  },
  {
    title: "Driver Preference",
    content: `Riders may request female or male drivers based on availability. We respect your comfort and privacy at all times.`,
    icon: "👥",
    color: "from-purple-500/20 to-purple-600/10"
  },
  {
    title: "Payment Policy",
    content: `Full payment is required at the time of booking. No payment = No reservation. If payment is not completed, your booking will not be confirmed. Accepted payment methods: Zelle, Apple Pay, Venmo, Cash, or Card (upon request).`,
    icon: "💳",
    color: "from-yellow-500/20 to-yellow-600/10"
  },
  {
    title: "Cancellation & No-Show Policy",
    content: `Cancellations made 24+ hours in advance are free. Cancellations within less than 24 hours may be charged partially or fully. No-shows may result in 100% fare charge.`,
    icon: "❌",
    color: "from-red-500/20 to-red-600/10"
  },
  {
    title: "Flight Delays",
    content: `We track your flight status. No extra charges for delays out of your control. Please communicate updated flight info to ensure timely pickup.`,
    icon: "✈️",
    color: "from-indigo-500/20 to-indigo-600/10"
  },
  {
    title: "Privacy & Safety",
    content: `Your personal info and location are never shared or sold. All drivers are vetted, respectful, and trained for safe transport. Cameras may be installed inside vehicles for your safety and driver protection.`,
    icon: "🔒",
    color: "from-teal-500/20 to-teal-600/10"
  },
  {
    title: "Driver Conduct Policy",
    content: `Drivers are not allowed to ask, answer, or engage in any personal questions with clients. They are expected to maintain professionalism and focus solely on the ride experience and customer safety. This is to ensure privacy, comfort, and a respectful environment for all passengers.`,
    icon: "🎯",
    color: "from-orange-500/20 to-orange-600/10"
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

export default function FAQPoliciesPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.faqs.getAll();
      setFaqs(response);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="min-h-screen bg-black text-white">
          <div className="w-full h-14 sm:h-16 bg-black" />
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-lg text-gray-300">Loading FAQs...</p>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="min-h-screen bg-black text-white">
          <div className="w-full h-14 sm:h-16 bg-black" />
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <p className="text-lg text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchFAQs}
                className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="min-h-screen bg-black text-white">
        <div className="w-full h-14 sm:h-16 bg-black" />
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/assets/general/faq-policies-bg.jpg"
              alt="FAQ & Policies"
              fill
              priority
              className="object-cover opacity-40"
              onError={(e) => {
                                    // FAQ background image failed to load
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
          </div>

          {/* Animated Question Mark Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-gold/20 text-4xl"
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.2, 0.6, 0.2],
                  rotate: [0, 10, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              >
                ❓
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-gold drop-shadow-gold text-center mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              CALI GOLD DRIVE
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-4xl font-bold text-white text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            >
              FAQ & Policies
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-300 text-center max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            >
              Everything you need to know about our services, policies, and how we ensure your comfort and safety.
            </motion.p>
          </div>
        </section>

        {/* Search Bar */}
        <motion.section
          className="max-w-4xl mx-auto px-4 mt-[-40px] mb-10 relative z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-black/80 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent backdrop-blur"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 mb-20">
          <motion.h3
            className="text-3xl font-bold text-gold text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            Frequently Asked Questions
          </motion.h3>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-300">
                {searchTerm ? `No FAQs found for "${searchTerm}"` : "No FAQs available"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  className="bg-gradient-to-r from-[#181818] to-[#23210e] rounded-xl border border-gold/30 overflow-hidden"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gold/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{faq.iconEmoji}</span>
                      <div>
                        <h4 className="font-semibold text-white text-lg">{faq.question}</h4>
                        <p className="text-sm text-gray-400 mt-1">{faq.category}</p>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gold text-xl"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Policies Section */}
        <section className="max-w-6xl mx-auto px-4 mb-20">
          <motion.h3
            className="text-3xl font-bold text-gold text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            Our Policies
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                className={`bg-gradient-to-br ${policy.color} rounded-xl p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:scale-105`}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                <div className="text-3xl mb-4">{policy.icon}</div>
                <h4 className="font-bold text-white text-lg mb-3">{policy.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{policy.content}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 mb-20">
          <motion.div
            className="bg-gradient-to-r from-gold/10 via-black to-gold/10 rounded-2xl p-10 text-center border border-gold/30"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold text-gold mb-4">Still Have Questions?</h3>
            <p className="text-gray-300 mb-6">
              Can't find what you're looking for? We're here to help! Contact us directly and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-gold text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="tel:657-562-4945"
                className="inline-block bg-transparent border border-gold text-gold font-bold px-8 py-3 rounded-lg hover:bg-gold hover:text-black transition-colors"
              >
                Call Now
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}