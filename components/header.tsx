"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Responsive navigation items
  const navItems = [
    { name: 'Home', href: '/', fullName: 'Home' },
    { name: 'Services', href: '/services', fullName: 'Services' },
    { name: 'Fleet', href: '/fleet', fullName: 'Fleet' },
    { name: 'About', href: '/about', fullName: 'About' },
    { name: 'Why Choose', href: '/why-choose-us', fullName: 'Why Choose Us' },
    { name: 'FAQ', href: '/faq-policies', fullName: 'FAQ & Policies' },
    { name: 'Contact', href: '/contact', fullName: 'Contact' }
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/98 backdrop-blur-md shadow-2xl border-b border-gold/10' : 'bg-black/90 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Responsive */}
          <motion.div
            className="flex items-center space-x-1 sm:space-x-2"
            whileHover={{ scale: 1.02 }}
          >
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <div className="text-lg sm:text-xl lg:text-2xl font-extrabold">
                <span className="text-gold">CALI</span>
                <span className="text-gold ml-0.5">GOLD</span>
              </div>
              <div className="text-white text-xs sm:text-sm font-light tracking-wide">
                DRIVE
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Appears on large screens */}
          <nav className="hidden 2xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg whitespace-nowrap ${
                    pathname === item.href 
                      ? 'text-gold bg-gold/15 shadow-lg shadow-gold/20' 
                      : 'text-white hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  {item.fullName}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Compact Desktop Navigation - Appears on xl screens */}
          <nav className="hidden xl:flex 2xl:hidden items-center space-x-0.5">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={item.href}
                  className={`text-xs font-medium transition-all duration-300 px-2 py-2 rounded-lg whitespace-nowrap ${
                    pathname === item.href 
                      ? 'text-gold bg-gold/15 shadow-lg shadow-gold/20' 
                      : 'text-white hover:text-gold hover:bg-gold/10'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Action Buttons - Responsive */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Buttons - Hidden on smaller screens */}
            <div className="hidden lg:flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  className="bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-lg"
                >
                  Book Now
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/fleet"
                  className="bg-transparent border border-gold text-gold font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-gold hover:text-black transition-all duration-300"
                >
                  Choose Ride
                </Link>
              </motion.div>
            </div>

            {/* Call Button - Always Visible but Responsive */}
            <motion.a
              href="tel:6575624945"
              className="bg-gold text-black font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-yellow-400 transition-all duration-300 flex items-center space-x-1 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">📞</span>
              <span className="hidden sm:inline">Call</span>
            </motion.a>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden text-gold p-2 hover:bg-gold/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
                <motion.span
                  className={`bg-gold block h-0.5 w-5 sm:w-6 rounded-sm transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                  }`}
                />
                <motion.span
                  className={`bg-gold block h-0.5 w-5 sm:w-6 rounded-sm transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <motion.span
                  className={`bg-gold block h-0.5 w-5 sm:w-6 rounded-sm transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu - Solid Black Background */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="xl:hidden fixed top-0 left-0 right-0 bottom-0 bg-black z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Menu Content Container */}
              <motion.div
                className="absolute top-0 left-0 right-0 min-h-screen bg-black border-b border-gold/30 shadow-2xl"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Menu Header with Close Button */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gold/20 bg-black">
                  <div className="flex items-center space-x-3">
                    <span className="text-gold text-2xl">🚗</span>
                    <span className="text-gold font-bold text-lg">CALI GOLD DRIVE</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gold hover:text-yellow-400 p-2 rounded-lg hover:bg-gold/10 transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="px-4 py-6 space-y-3 bg-black min-h-screen">
                  {/* Enhanced Navigation Links - Mobile Optimized */}
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <Link
                          href={item.href}
                          className={`block transition-all duration-300 py-4 px-4 rounded-xl border border-transparent ${
                            pathname === item.href 
                              ? 'text-gold bg-gold/20 shadow-lg shadow-gold/30 border-gold/40' 
                              : 'text-white hover:text-gold hover:bg-gold/10 hover:border-gold/20'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-xl sm:text-2xl">
                                {item.name === 'Home' && '🏠'}
                                {item.name === 'Services' && '🚗'}
                                {item.name === 'Fleet' && '🚙'}
                                {item.name === 'About' && 'ℹ️'}
                                {item.name === 'Why Choose' && '💎'}
                                {item.name === 'FAQ' && '❓'}
                                {item.name === 'Contact' && '📞'}
                              </span>
                              <span className="font-semibold text-base sm:text-lg">{item.fullName}</span>
                            </div>
                            {pathname === item.href && (
                              <span className="text-gold text-xl">✓</span>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Action Buttons for Mobile */}
                  <div className="pt-6 space-y-4 border-t border-gold/20">
                    <motion.a
                      href="https://wa.me/16575624945"
                      className="block w-full bg-gradient-to-r from-gold to-yellow-400 text-black font-bold py-4 rounded-xl text-center hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-lg text-base sm:text-lg border border-gold/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-xl sm:text-2xl">💬</span>
                        <span className="font-semibold">Book Now on WhatsApp</span>
                      </div>
                    </motion.a>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        href="/fleet"
                        className="block w-full border-2 border-gold text-gold font-bold py-4 rounded-xl text-center hover:bg-gold hover:text-black transition-all duration-300 text-base sm:text-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <span className="text-xl sm:text-2xl">🚗</span>
                          <span className="font-semibold">Choose Your Ride</span>
                        </div>
                      </Link>
                    </motion.div>
                    
                    {/* Quick Contact Options */}
                    <motion.div
                      className="grid grid-cols-2 gap-3 pt-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <a
                        href="tel:6575624945"
                        className="bg-green-600 text-white font-bold py-3 rounded-lg text-center hover:bg-green-500 transition-all duration-300 text-sm border border-green-500/30"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>📞</span>
                          <span>Call Now</span>
                        </div>
                      </a>
                      <a
                        href="mailto:info@caligolddrive.com"
                        className="bg-blue-600 text-white font-bold py-3 rounded-lg text-center hover:bg-blue-500 transition-all duration-300 text-sm border border-blue-500/30"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>📧</span>
                          <span>Email</span>
                        </div>
                      </a>
                    </motion.div>
                  </div>

                  {/* Contact Info for Mobile */}
                  <motion.div 
                    className="pt-4 border-t border-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="text-center text-gray-400 text-sm">
                      <p className="mb-2">Available 24/7</p>
                      <div className="flex justify-center space-x-4 text-xs">
                        <a href="tel:6575624945" className="text-gold hover:text-yellow-400">
                          📞 Call
                        </a>
                        <a href="https://wa.me/16575624945" className="text-gold hover:text-yellow-400">
                          💬 WhatsApp
                        </a>
                        <a href="https://www.instagram.com/caligolddrivellc?igsh=MWM0MXkybnkxMzA2aw==" className="text-gold hover:text-yellow-400">
                          📷 Instagram
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Backdrop Click Handler */}
              <div 
                className="absolute inset-0 bg-black/80"
                onClick={() => setIsMenuOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;