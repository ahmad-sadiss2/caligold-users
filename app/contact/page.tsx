"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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

const contactDetails = [
  {
    icon: (
      <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.09a2 2 0 0 1 1.41.59l2.83 2.83a2 2 0 0 0 1.41.59H19a2 2 0 0 1 2 2v2.08" /></svg>
    ),
    label: "Phone",
    value: "657-562-4945",
    desc: "Call us anytime 24/7.",
    link: "tel:6575624945",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
    ),
    label: "WhatsApp",
    value: "657-562-4945",
    desc: "Message us 24/7 for bookings & support.",
    link: "https://wa.me/16575624945",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" /><path d="M2 21v-2a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v2" /></svg>
    ),
    label: "Instagram",
    value: "@caligolddrivellc",
    desc: "Follow us for updates.",
    link: "https://www.instagram.com/caligolddrivellc?igsh=MWM0MXkybnkxMzA2aw==",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2v20" /></svg>
    ),
    label: "Website",
    value: "www.caligolddrive.com",
    desc: "Book online or find more info.",
    link: "https://www.caligolddrive.com",
  },
  {
    icon: (
      <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    ),
    label: "Service Area",
    value: "Serving Los Angeles, Orange County, San Diego, and Riverside",
    desc: "",
    link: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState<{ teamSent: boolean; customerSent: boolean } | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("sending");
    setEmailStatus(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: 'Contact Form Submission',
          message: form.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        
        // Store email notification status
        if (data.emailNotifications) {
          setEmailStatus({
            teamSent: data.emailNotifications.teamNotificationSent,
            customerSent: data.emailNotifications.customerConfirmationSent
          });
        }
        
        setTimeout(() => {
          setStatus("");
          setEmailStatus(null);
        }, 5000); // Longer timeout to show email status
      } else {
        setStatus("error");
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16">
        
        {/* Hero Section */}
        <section className="relative h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden mb-12">
          <Image
            src="/assets/general/contact-page-bg.jpg"
            alt="Contact CALI GOLD DRIVE"
            fill
            priority
            className="object-cover"
            style={{ zIndex: 0 }}
            onError={(e) => {
                                  // Contact background image failed to load
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/60" style={{ zIndex: 1 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" style={{ zIndex: 2 }} />
          <div className="relative z-10 flex flex-col items-center justify-center w-full">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-gold drop-shadow-gold text-center mb-2 tracking-tight font-serif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Contact CALI GOLD DRIVE
            </motion.h1>
            <motion.p
              className="text-lg md:text-2xl text-white text-center max-w-2xl mx-auto mb-2 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Experience luxury service. Book, message, or ask us anything 24/7.
            </motion.p>
          </div>
        </section>
        
        {/* Cards Section */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch px-4 pb-20">
          {/* Left: Contact Info Card */}
          <motion.div
            className="bg-black/70 rounded-2xl border border-gold/30 shadow-2xl p-10 flex flex-col justify-center backdrop-blur-xl relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-2xl font-bold text-gold mb-8 font-serif tracking-tight">Get in Touch</h2>
            <div className="space-y-7">
              {contactDetails.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-start gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  custom={i + 1}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <span className="mt-1 drop-shadow-gold">{item.icon}</span>
                  <div>
                    <div className="font-bold text-gold text-lg font-serif">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {item.label}
                        </a>
                      ) : (
                        item.label
                      )}
                    </div>
                    <div className="text-white font-mono text-base leading-tight">{item.value}</div>
                    {item.desc && <div className="text-gray-400 text-sm mt-1">{item.desc}</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right: Luxury Message Card + Form */}
          <motion.div
            className="relative bg-black/70 rounded-2xl border-2 border-gold shadow-2xl flex flex-col justify-center items-center p-10 md:p-14 min-h-[340px] overflow-hidden backdrop-blur-xl"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {/* Gold border corners */}
            <span className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold rounded-tl-2xl" />
            <span className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold rounded-tr-2xl" />
            <span className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold rounded-bl-2xl" />
            <span className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold rounded-br-2xl" />
            
            <motion.h2
              className="text-3xl md:text-4xl font-extrabold text-gold text-center mb-4 drop-shadow-gold font-serif tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              CONTACT US
            </motion.h2>
            
            <motion.p
              className="text-xl md:text-2xl text-gold text-center mb-6 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Get in touch to book your luxury car experience
            </motion.p>
            
            <motion.div
              className="w-20 h-1 bg-gradient-to-r from-gold to-yellow-400 rounded-full mx-auto mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ transformOrigin: 'left' }}
            />
            
            <motion.a
              href="https://wa.me/16575624945"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-8 py-3 rounded-lg shadow-lg hover:from-yellow-400 hover:to-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 text-lg mt-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Book Now on WhatsApp
            </motion.a>
            
            {/* Contact Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-md mx-auto space-y-5"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <motion.input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black border border-gold/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                required
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={1}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black border border-gold/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                required
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={2}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black border border-gold/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
                required
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={3}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-black font-bold py-3 rounded-lg shadow-lg hover:from-yellow-400 hover:to-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 text-lg"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={4}
                disabled={status === "sending"}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent!" : "Send Message"}
              </motion.button>

              {/* Success/Error Messages */}
              {status === "sent" && (
                <motion.div
                  className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-green-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">Thank you! Your message has been sent successfully.</span>
                  </div>
                  <p className="text-sm text-green-200 mb-3">
                    We've received your inquiry and will respond within 2 hours during business hours.
                  </p>
                  
                  {emailStatus && (
                    <div className="text-xs text-green-300 space-y-1">
                      <div className="flex items-center">
                        {emailStatus.customerSent ? (
                          <>
                            <svg className="w-4 h-4 text-green-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Confirmation email sent to you</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>Confirmation email pending</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        {emailStatus.teamSent ? (
                          <>
                            <svg className="w-4 h-4 text-green-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Team notification sent</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span>Team notification pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-semibold">Sorry, there was an error sending your message.</span>
                  </div>
                  <p className="text-sm text-red-200 mt-1">
                    Please try again or contact us directly at{" "}
                    <a href="https://wa.me/16575624945" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>.
                  </p>
                </motion.div>
              )}
            </motion.form>
          </motion.div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}