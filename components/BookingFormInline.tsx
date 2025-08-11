// Updated BookingFormInline with Enhanced English Date/Time Pickers
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PlacesAutocomplete from './PlacesAutocomplete';
import EnhancedDatePicker from './EnhancedDatePicker';
import EnhancedTimePicker from './EnhancedTimePicker';
import { phoneValidation } from '@/lib/utils';

interface FormData {
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
}

interface FormErrors {
  [key: string]: string;
}

const UpdatedBookingFormInline = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    pickupLocation: '',
    pickupDetails: '',
    dropoffLocation: '',
    dropoffDetails: '',
    serviceDate: '',
    pickupTime: '',
    serviceType: 'airport-pickup',
    passengers: '1',
    email: '',
    mobile: '',
    roundTrip: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Location validation
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    } else if (formData.pickupLocation.trim().length < 5) {
      newErrors.pickupLocation = 'Please provide a more detailed pickup location';
    }

    if (!formData.dropoffLocation.trim()) {
      newErrors.dropoffLocation = 'Drop-off location is required';
    } else if (formData.dropoffLocation.trim().length < 5) {
      newErrors.dropoffLocation = 'Please provide a more detailed drop-off location';
    }

    // Date and time validation
    if (!formData.serviceDate) {
      newErrors.serviceDate = 'Service date is required';
    } else {
      const selectedDate = new Date(formData.serviceDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.serviceDate = 'Service date cannot be in the past';
      }
    }

    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Pickup time is required';
    } else if (formData.serviceDate) {
      const selectedDateTime = new Date(`${formData.serviceDate}T${formData.pickupTime}`);
      const minDateTime = new Date();
      minDateTime.setHours(minDateTime.getHours() + 2);
      
      if (selectedDateTime < minDateTime) {
        newErrors.pickupTime = 'Pickup time must be at least 2 hours from now';
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation using American phone validation
    const phoneError = phoneValidation.getPhoneErrorMessage(formData.mobile);
    if (phoneError) {
      newErrors.mobile = phoneError;
    }

    // Passengers validation
    const passengerCount = parseInt(formData.passengers);
    if (passengerCount < 1 || passengerCount > 50) {
      newErrors.passengers = 'Number of passengers must be between 1 and 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let newValue = type === 'checkbox' ? checked : value;
    
    // Handle phone number formatting
    if (name === 'mobile') {
      newValue = phoneValidation.formatAmericanPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep('confirmation');
    }
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    
    // Store booking data in sessionStorage for the vehicle selection page
    const bookingData = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    
    // Redirect to vehicle selection page
    router.push(`/select-vehicle?passengers=${formData.passengers}`);
  };

  const handleEdit = () => {
    setStep('form');
  };

  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinDateTime = (): { minDate: Date; minTime?: string } => {
    const now = new Date();
    const minDateTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    
    const isToday = formData.serviceDate === getTodayDate();
    
    return {
      minDate: now,
      minTime: isToday ? `${minDateTime.getHours().toString().padStart(2, '0')}:${minDateTime.getMinutes().toString().padStart(2, '0')}` : undefined
    };
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDisplayTime = (timeString: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const renderForm = () => (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Personal Information Section */}
      <div className="space-y-4">
        <motion.h4 
          className="text-lg font-semibold text-gold flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="mr-2">👤</span>
          Personal Information
        </motion.h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.firstName 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                  : focusedField === 'firstName'
                    ? 'border-gold focus:border-gold focus:ring-gold/20 shadow-lg shadow-gold/20'
                    : 'border-gold/30 focus:border-gold focus:ring-gold/20'
              }`}
              placeholder="First Name *"
            />
            <AnimatePresence>
              {errors.firstName && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {errors.firstName}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.lastName 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                  : focusedField === 'lastName'
                    ? 'border-gold focus:border-gold focus:ring-gold/20 shadow-lg shadow-gold/20'
                    : 'border-gold/30 focus:border-gold focus:ring-gold/20'
              }`}
              placeholder="Last Name *"
            />
            <AnimatePresence>
              {errors.lastName && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {errors.lastName}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Location Information Section */}
      <div className="space-y-4">
        <motion.h4 
          className="text-lg font-semibold text-gold flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="mr-2">📍</span>
          Trip Locations
        </motion.h4>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <PlacesAutocomplete
            value={formData.pickupLocation}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, pickupLocation: value }));
              if (errors.pickupLocation) {
                setErrors(prev => ({ ...prev, pickupLocation: '' }));
              }
            }}
            placeholder="📍 Pickup Address (Street, City, State)"
            error={errors.pickupLocation}
            isDarkTheme={true}
            required={true}
            icon={<span className="text-gold">🚗</span>}
            onPlaceSelect={(place) => {
              // Pickup place selected
            }}
          />
          
          <textarea
            name="pickupDetails"
            value={formData.pickupDetails}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none transition-all duration-200"
            placeholder="🏢 Pickup Details (Building #, Room #, Floor, Special Instructions)"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <PlacesAutocomplete
            value={formData.dropoffLocation}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, dropoffLocation: value }));
              if (errors.dropoffLocation) {
                setErrors(prev => ({ ...prev, dropoffLocation: '' }));
              }
            }}
            placeholder="🎯 Drop-off Address (Street, City, State)"
            error={errors.dropoffLocation}
            isDarkTheme={true}
            required={true}
            icon={<span className="text-gold">🏁</span>}
            onPlaceSelect={(place) => {
              // Dropoff place selected
            }}
          />
          
          <textarea
            name="dropoffDetails"
            value={formData.dropoffDetails}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none transition-all duration-200"
            placeholder="🏢 Drop-off Details (Building #, Room #, Floor, Special Instructions)"
          />
        </motion.div>
      </div>

      {/* Trip Details Section */}
      <div className="space-y-4">
        <motion.h4 
          className="text-lg font-semibold text-gold flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
        >
          <span className="mr-2">🕐</span>
          Trip Details
        </motion.h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EnhancedDatePicker
              value={formData.serviceDate}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, serviceDate: date }));
                if (errors.serviceDate) {
                  setErrors(prev => ({ ...prev, serviceDate: '' }));
                }
              }}
              label="Pickup Date"
              placeholder="Select pickup date"
              minDate={getMinDateTime().minDate}
              error={errors.serviceDate}
              required={true}
              isDarkTheme={true}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <EnhancedTimePicker
              value={formData.pickupTime}
              onChange={(time) => {
                setFormData(prev => ({ ...prev, pickupTime: time }));
                if (errors.pickupTime) {
                  setErrors(prev => ({ ...prev, pickupTime: '' }));
                }
              }}
              label="Pickup Time"
              placeholder="Select pickup time"
              minTime={getMinDateTime().minTime}
              error={errors.pickupTime}
              required={true}
              isDarkTheme={true}
              step={30}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-white text-sm font-medium mb-2 flex items-center">
              <span className="mr-2">🚙</span>
              Service Type
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/50 border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-200"
            >
              <option value="airport-pickup">✈️ Airport Pickup</option>
              <option value="airport-dropoff">🛫 Airport Drop-off</option>
              <option value="business-meeting">💼 Business</option>
              <option value="special-event">🎉 Event</option>
              <option value="medical-appointment">🏥 Medical</option>
              <option value="shopping-errands">🛍️ Shopping & Errands</option>
              <option value="custom">✨ Custom</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <label className="block text-white text-sm font-medium mb-2 flex items-center">
              <span className="mr-2">👥</span>
              Passengers *
            </label>
            <select
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.passengers 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-gold/30 focus:border-gold focus:ring-gold/20'
              }`}
            >
              {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                <option key={num} value={num} className="bg-black text-white">
                  {num} {num === 1 ? 'Person' : 'People'}
                </option>
              ))}
            </select>
            <AnimatePresence>
              {errors.passengers && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {errors.passengers}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <motion.h4 
          className="text-lg font-semibold text-gold flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="mr-2">📞</span>
          Contact Information
        </motion.h4>
        
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-gold/30 focus:border-gold focus:ring-gold/20'
              }`}
              placeholder="📧 Email Address *"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.mobile 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' 
                  : 'border-gold/30 focus:border-gold focus:ring-gold/20'
              }`}
              placeholder="📱 (555) 123-4567"
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
      </div>

      {/* Round Trip Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="flex items-center space-x-3 p-4 bg-gold/10 rounded-lg border border-gold/20"
      >
        <input
          type="checkbox"
          name="roundTrip"
          checked={formData.roundTrip}
          onChange={handleChange}
          className="w-5 h-5 bg-black/50 border-2 border-gold/30 rounded focus:ring-gold text-gold"
        />
        <label className="text-white font-medium flex items-center">
          <span className="mr-2">🔄</span>
          Round Trip (Return journey needed)
        </label>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="pt-4"
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold text-lg rounded-lg shadow-xl hover:from-yellow-400 hover:to-gold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">🚗</span>
            Continue to Vehicle Selection
          </span>
        </button>
        <p className="text-gray-400 text-xs text-center mt-3">
          By continuing, you'll be able to select your preferred vehicle and see pricing
        </p>
      </motion.div>
    </motion.form>
  );

  const renderConfirmation = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-2xl">✅</span>
        </motion.div>
        <h3 className="text-xl font-bold text-gold mb-2">Confirm Your Booking Details</h3>
        <p className="text-gray-300 text-sm">Please review your information before proceeding</p>
      </div>

      <div className="bg-black/30 rounded-lg p-4 space-y-4 text-sm border border-gold/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 block mb-1">Name:</span>
            <p className="text-white font-medium">{formData.firstName} {formData.lastName}</p>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Passengers:</span>
            <p className="text-white font-medium">{formData.passengers} {parseInt(formData.passengers) === 1 ? 'Person' : 'People'}</p>
          </div>
        </div>

        <div>
          <span className="text-gray-400 block mb-1">Pickup:</span>
          <p className="text-white font-medium">{formData.pickupLocation}</p>
          {formData.pickupDetails && (
            <p className="text-gray-300 text-xs mt-1 bg-gray-800/50 rounded px-2 py-1">📍 {formData.pickupDetails}</p>
          )}
        </div>

        <div>
          <span className="text-gray-400 block mb-1">Drop-off:</span>
          <p className="text-white font-medium">{formData.dropoffLocation}</p>
          {formData.dropoffDetails && (
            <p className="text-gray-300 text-xs mt-1 bg-gray-800/50 rounded px-2 py-1">📍 {formData.dropoffDetails}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 block mb-1">Date:</span>
            <p className="text-white font-medium">{formatDisplayDate(formData.serviceDate)}</p>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Time:</span>
            <p className="text-white font-medium">{formatDisplayTime(formData.pickupTime)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 block mb-1">Service:</span>
            <p className="text-white font-medium">{formData.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          </div>
          <div>
            <span className="text-gray-400 block mb-1">Trip Type:</span>
            <p className="text-white font-medium">{formData.roundTrip ? '🔄 Round Trip' : '➡️ One Way'}</p>
          </div>
        </div>

        <div>
          <span className="text-gray-400 block mb-1">Contact:</span>
          <p className="text-white font-medium">{formData.email}</p>
          <p className="text-white font-medium">{formData.mobile}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleEdit}
          className="flex-1 py-3 bg-transparent border border-gold/50 text-gold font-medium rounded-lg hover:bg-gold/10 transition-all duration-300"
        >
          ← Edit Details
        </button>
        
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
              Processing...
            </span>
          ) : (
            'Select Vehicle →'
          )}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === 'confirmation' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step === 'confirmation' ? -50 : 50 }}
          transition={{ duration: 0.3 }}
        >
          {step === 'form' ? renderForm() : renderConfirmation()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UpdatedBookingFormInline; 