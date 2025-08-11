"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppButton from '../components/whatsapp-button';
import CustomerReviews from '../components/customer-reviews';

import { api } from '@/lib/api';
import { HomepageContent, Feature, Review, ServiceArea, Statistics } from '@/lib/api';
import PlacesAutocomplete from '../components/PlacesAutocomplete';
import { phoneValidation } from '@/lib/utils';

import EnhancedHero from '../components/EnhancedHero';
import EnhancedDatePicker from '../components/EnhancedDatePicker';
import EnhancedTimePicker from '../components/EnhancedTimePicker';



// Why Choose Us Section
const WhyChooseUs = ({ features }: { features?: Feature[] }) => {
  
  const defaultFeatures: Feature[] = [
    {
      id: 1,
      icon: "🐾",
      title: "100% Pet-Friendly",
      description: "Bring your furry friends along at no additional cost. We understand they're part of the family.",
      imageUrl: "/assets/features/feature-luxury-fleet.jpg",
      displayOrder: 1
    },
    {
      id: 2,
      icon: "👥",
      title: "Driver Choice",
      description: "Request your preferred driver for comfort and safety. Your peace of mind matters to us.",
      imageUrl: "/assets/features/feature-luxury-fleet.jpg",
      displayOrder: 2
    },
    {
      id: 3,
      icon: "💳",
      title: "Flexible Payment",
      description: "Zelle, Apple Pay, Venmo, Cash, or Card. Choose what's convenient for you.",
      imageUrl: "/assets/features/feature-luxury-fleet.jpg",
      displayOrder: 3
    },
    {
      id: 4,
      icon: "✈️",
      title: "Flight Tracking",
      description: "We track your flights and adjust pickup times automatically. No extra charges for delays.",
      imageUrl: "/assets/features/feature-luxury-fleet.jpg",
      displayOrder: 4
    },
    {
      id: 5,
      icon: "🛡️",
      title: "Safety First",
      description: "All drivers are professionally vetted, respectful, and trained for your safety.",
      imageUrl: "/assets/features/feature-luxury-fleet.jpg",
      displayOrder: 5
    },
    {
      id: 6,
      icon: "🚗",
      title: "Premium Fleet",
      description: "SUVs, Sedans, and Vans - all maintained to the highest standards of cleanliness and comfort.",
      imageUrl: "/assets/features/feature-luxury-fleet.jpg",
      displayOrder: 6
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
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
                    transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            Why Choose CALI GOLD DRIVE
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-400 mx-auto rounded-full" />
          <p className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto">
            Experience the difference with gold-level service that puts your comfort and needs first
          </p>
        </motion.div>

        {/* Enhanced Mobile-Responsive Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {(features || defaultFeatures).map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl sm:rounded-2xl overflow-hidden border border-gold/30 hover:border-gold/70 transition-all duration-500 shadow-xl cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Enhanced Feature Image - Mobile Optimized */}
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src={
                    feature.imageUrl 
                      ? feature.imageUrl.startsWith('http') 
                        ? feature.imageUrl 
                        : `http://45.32.74.216/api${feature.imageUrl}`
                      : "/assets/features/feature-luxury-fleet.jpg"
                  }
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                                          e.currentTarget.src = "/assets/vehicles/vehicle-fallback.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Enhanced Feature Icon - Mobile Optimized */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gold/90 backdrop-blur-sm text-black p-2 sm:p-3 rounded-full text-xl sm:text-2xl shadow-lg">
                  {feature.icon}
                </div>
              </div>

              {/* Enhanced Feature Content - Mobile Optimized */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gold mb-2 group-hover:text-yellow-400 transition-colors leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Mobile-Only Quick Action */}
                <div className="sm:hidden mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gold/70 bg-gold/10 px-2 py-1 rounded-full">
                      Learn More
                    </span>
                    <span className="text-gold text-sm">→</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={false}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-16 mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            href="/why-choose-us"
            className="inline-block bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-8 py-4 rounded-xl text-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 shadow-2xl hover:shadow-gold/50"
          >
            Learn More About Our Service
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Customer Reviews Section


// Enhanced Booking Form Section
const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pickupLocation: '',
    dropoffLocation: '',
    serviceDate: '',
    pickupTime: '',
    serviceType: 'airport-pickup',
    passengers: '1',
    email: '',
    mobile: '',
    roundTrip: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    let newValue = type === 'checkbox' ? checked : value;
    
    // Handle phone number formatting
    if (name === 'mobile') {
      newValue = phoneValidation.formatAmericanPhone(value);
      
      // Clear error when user starts typing
      if (errors.mobile) {
        setErrors(prev => ({ ...prev, mobile: '' }));
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Basic field validations
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation.trim()) newErrors.dropoffLocation = 'Drop-off location is required';
    if (!formData.serviceDate) newErrors.serviceDate = 'Service date is required';
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation using our American phone validation
    const phoneError = phoneValidation.getPhoneErrorMessage(formData.mobile);
    if (phoneError) {
      newErrors.mobile = phoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      // Combine date and time for pickup
      const pickupDateTime = new Date(`${formData.serviceDate}T${formData.pickupTime}`);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.mobile,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          pickupDateTime: pickupDateTime.toISOString(),
          passengerCount: parseInt(formData.passengers),
          isRoundTrip: formData.roundTrip,
          specialRequests: `Service Type: ${formData.serviceType}`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Booking submitted successfully! Reference: ${result.data}`);
        
        // Also send WhatsApp message for immediate contact
        const message = `🚗 CALI GOLD DRIVE - Booking Request

👤 Name: ${formData.firstName} ${formData.lastName}
📍 Pickup: ${formData.pickupLocation}
📍 Dropoff: ${formData.dropoffLocation}
📅 Date: ${formData.serviceDate}
🕐 Time: ${formData.pickupTime}
🚙 Service: ${formData.serviceType}
👥 Passengers: ${formData.passengers}
📧 Email: ${formData.email}
📱 Mobile: ${formData.mobile}
🔄 Round Trip: ${formData.roundTrip ? 'Yes' : 'No'}

Please confirm availability and pricing. Thank you!`;

        const whatsappUrl = `https://wa.me/16574624945?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again or contact us directly.');
    }
  };

  return (
    <div className="w-full pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-4xl font-extrabold text-gold mb-4 tracking-tight leading-tight">
                Book Your Gold Experience
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-400 mx-auto rounded-full mb-4" />
              <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                Get instant pricing and availability for your premium ride
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border-2 border-gold/30 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Gold Corner Decorations */}
              <span className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold rounded-tl-3xl" />
              <span className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold rounded-tr-3xl" />
              <span className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold rounded-bl-3xl" />
              <span className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gold rounded-br-3xl" />

              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="Enter your first name"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="Enter your last name"
                />
              </motion.div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  📍 Pickup Location *
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="Address, Airport Code, or Point of Interest"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  🎯 Drop-off Location *
                </label>
                <input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="Address, Airport Code, or Point of Interest"
                />
              </motion.div>
            </div>

            {/* Date and Time */}
            {/* Trip Details Section */}
            <div className="bg-black/30 rounded-lg p-4 border border-gold/20 mb-6">
              <motion.h4 
                className="text-gold font-semibold text-lg mb-4 flex items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <span className="mr-2 text-xl">📅</span>
                Trip Details
              </motion.h4>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                  <label className="block text-white text-sm font-medium mb-2 flex items-center">
                  <span className="mr-2">📅</span>
                  Pickup Date *
                </label>
                                    <EnhancedDatePicker
                  value={formData.serviceDate}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, serviceDate: date }));
                  }}
                  placeholder="Select pickup date"
                  minDate={new Date()}
                    required={true}
                    isDarkTheme={true}
                  className="h-12"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                  <label className="block text-white text-sm font-medium mb-2 flex items-center">
                  <span className="mr-2">🕐</span>
                  Pickup Time *
                </label>
                  <EnhancedTimePicker
                  value={formData.pickupTime}
                  onChange={(time) => {
                    setFormData(prev => ({ ...prev, pickupTime: time }));
                  }}
                  placeholder="Select pickup time"
                    required={true}
                    isDarkTheme={true}
                  className="h-12"
                />
              </motion.div>
              </div>
            </div>

            {/* Service Type and Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  🚗 Type of Service
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-xl text-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                >
                  <option value="airport-pickup">✈️ Airport Pickup</option>
                  <option value="airport-dropoff">🛫 Airport Drop-off</option>
                  <option value="business-meeting">💼 Business Meeting</option>
                  <option value="special-event">🎉 Special Event</option>
                  <option value="medical-appointment">🏥 Medical Appointment</option>
                  <option value="shopping-errands">🛍️ Shopping & Errands</option>
                  <option value="custom">✨ Custom Service</option>
                </select>
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  👥 Number of Passengers
                </label>
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-xl text-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                >
                  {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  📧 Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="your.email@example.com"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
              >
                <label className="block text-gold font-semibold text-sm">
                  📱 Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-black/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.mobile 
                      ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                      : 'border-gold/30 focus:border-gold focus:ring-gold/20'
                  }`}
                  placeholder="(555) 123-4567"
                />
                <AnimatePresence>
                  {errors.mobile && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs mt-1"
                    >
                      {errors.mobile}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Round Trip Option */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.3 }}
            >
              <input
                type="checkbox"
                name="roundTrip"
                checked={formData.roundTrip}
                onChange={handleChange}
                className="w-5 h-5 bg-black/50 border-2 border-gold/30 rounded focus:ring-gold text-gold"
              />
              <label className="text-white font-medium">
                🔄 Round Trip (Return journey needed)
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="text-center pt-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
            >
              <button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-xl rounded-xl shadow-2xl hover:from-yellow-400 hover:to-gold transition-all duration-300 transform hover:scale-105"
              >
                💬 GET PRICES & AVAILABILITY
              </button>
              <p className="text-gray-400 text-sm mt-4">
                Your booking request will be sent via WhatsApp for instant confirmation
              </p>
            </motion.div>
          </form>
        </motion.div>
          </div>

          {/* Trust Indicators - Right Side */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
          >
            {[
              { icon: "⚡", title: "Instant", subtitle: "Response", desc: "Get pricing within minutes" },
              { icon: "🔒", title: "Secure", subtitle: "Booking", desc: "Your information is protected" },
              { icon: "💎", title: "Gold", subtitle: "Guarantee", desc: "Premium service guaranteed" }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-gold/30 shadow-xl text-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, x: -5 }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-gold font-bold text-lg leading-tight">
                  <div>{item.title}</div>
                  <div>{item.subtitle}</div>
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Service Areas Section
const ServiceAreas = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold mb-3 sm:mb-4">
            Serving All of Southern California
          </h3>
          <p className="text-base sm:text-lg text-gray-300">
            Premium transportation across four major counties
          </p>
        </motion.div>

        {/* Enhanced Mobile-Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { 
              city: "Los Angeles", 
              icon: "🏙️", 
              desc: "Downtown, Hollywood, Beverly Hills, Santa Monica",
              airports: ["LAX", "BUR", "LGB"],
              highlights: ["Downtown LA", "Hollywood", "Beverly Hills"]
            },
            { 
              city: "Orange County", 
              icon: "🌴", 
              desc: "Anaheim, Irvine, Newport Beach, Huntington Beach",
              airports: ["SNA", "LGB"],
              highlights: ["Disneyland", "Newport Beach", "Irvine"]
            },
            { 
              city: "San Diego", 
              icon: "🏖️", 
              desc: "Downtown, La Jolla, Mission Beach, Coronado",
              airports: ["SAN", "CLD"],
              highlights: ["La Jolla", "Coronado", "Gaslamp"]
            },
            { 
              city: "Riverside", 
              icon: "🏔️", 
              desc: "Riverside, Corona, Moreno Valley, Palm Springs",
              airports: ["ONT", "PSP"],
              highlights: ["Palm Springs", "Riverside", "Corona"]
            }
          ].map((area, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 sm:p-6 border border-gold/20 hover:border-gold/50 transition-all duration-300 text-center group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Enhanced Icon with Mobile Optimization */}
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {area.icon}
              </div>
              
              {/* City Name with Better Mobile Typography */}
              <h4 className="text-gold font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                {area.city}
              </h4>
              
              {/* Description with Improved Mobile Readability */}
              <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                {area.desc}
              </p>
              
              {/* Enhanced Airport Codes - Mobile Optimized */}
              <div className="mb-3 sm:mb-4">
                <div className="text-gold/70 text-xs sm:text-sm font-mono bg-black/30 rounded-lg px-3 py-2">
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                    {area.airports.map((airport, idx) => (
                      <span 
                        key={idx}
                        className="inline-block bg-gold/20 text-gold px-2 py-1 rounded text-xs font-semibold"
                      >
                        {airport}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Mobile-Only Highlights (Hidden on Desktop) */}
              <div className="sm:hidden">
                <div className="flex flex-wrap justify-center gap-1">
                  {area.highlights.slice(0, 2).map((highlight, idx) => (
                    <span 
                      key={idx}
                      className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Coverage Stats - Mobile Optimized */}
        <motion.div
          className="mt-8 sm:mt-12 text-center bg-black/50 rounded-xl p-4 sm:p-6 border border-gold/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="group cursor-pointer">
              <div className="text-xl sm:text-2xl text-gold font-bold group-hover:scale-110 transition-transform">
                4
            </div>
              <div className="text-gray-400 text-xs sm:text-sm">Counties</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-xl sm:text-2xl text-gold font-bold group-hover:scale-110 transition-transform">
                8+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Airports</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-xl sm:text-2xl text-gold font-bold group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Cities</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Quick Contact Section with Mobile-Optimized Lists
const QuickContact = () => {
  return (
    <section className="py-12 sm:py-16 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gold mb-4 sm:mb-6">
            Prefer to Call or Message Directly?
          </h3>
          <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
            Our team is available 24/7 for immediate assistance
          </p>
          
          {/* Enhanced Contact Options - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:gap-4 sm:justify-center">
            {/* WhatsApp Button - Enhanced Mobile */}
            <motion.a
                              href="https://wa.me/16574624945"
              className="block w-full sm:w-auto px-6 sm:px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg sm:text-xl">💬</span>
              <span className="text-sm sm:text-base">WhatsApp Us</span>
            </motion.a>
            
            {/* Call Button - Enhanced Mobile */}
            <motion.a
              href="tel:6575624945"
              className="block w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg sm:text-xl">📞</span>
                              <span className="text-sm sm:text-base">Call (657) 562-4945</span>
            </motion.a>
          </div>

          {/* Enhanced Contact Methods List - Mobile Optimized */}
          <motion.div
            className="mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg sm:text-xl font-semibold text-gold mb-4 sm:mb-6">
              Multiple Ways to Reach Us
            </h4>
            
            {/* Contact Methods Grid - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                                      { icon: "📞", label: "Phone", value: "(657) 562-4945", action: "tel:6575624945" },
              { icon: "💬", label: "WhatsApp", value: "24/7 Support", action: "https://wa.me/16574624945" },
                { icon: "📧", label: "Email", value: "info@caligolddrive.com", action: "mailto:info@caligolddrive.com" }
              ].map((method, index) => (
                <motion.a
                  key={index}
                  href={method.action}
                  className="group bg-black/50 border border-gold/20 rounded-lg p-3 sm:p-4 hover:border-gold/50 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform">
                      {method.icon}
                    </div>
                    <div className="text-gold font-semibold text-sm sm:text-base mb-1">
                      {method.label}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      {method.value}
                    </div>
                  </div>
                </motion.a>
              ))}
          </div>
          </motion.div>

          {/* Service Hours - Mobile Optimized */}
          <motion.div
            className="mt-6 sm:mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
              <span className="text-gold text-sm">🕐</span>
              <span className="text-white text-sm font-medium">Available 24/7</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Page Component
export default function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageContent | null>(null);
  const [features, setFeatures] = useState<Feature[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch features from the dedicated features endpoint
        const featuresData = await api.getFeatures();
        setFeatures(featuresData);
        
        // Fetch homepage data
        const data = await api.homepage.getContent();
        setHomepageData(data);
      } catch (err) {
        // If backend is not available, show static content
        setError('Backend not available - showing static content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-xl">Loading CALI GOLD DRIVE...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Show static content if backend is not available
    return (
      <div className="bg-black text-white min-h-screen">
        <Header />
        <EnhancedHero />
        <WhyChooseUs />
        <CustomerReviews />
        <ServiceAreas />
        <QuickContact />
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <EnhancedHero 
        title={homepageData?.heroTitle}
        subtitle={homepageData?.heroSubtitle}
        description={homepageData?.heroDescription}
      />
      <WhyChooseUs features={features} />
      <CustomerReviews />
      <ServiceAreas />
      <QuickContact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}