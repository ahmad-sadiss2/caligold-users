"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  isDarkTheme?: boolean;
  minTime?: string;
  maxTime?: string;
  step?: number; // minutes between options (default: 30)
}

const EnhancedTimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  className = "",
  error,
  disabled = false,
  required = false,
  label,
  isDarkTheme = true,
  minTime,
  maxTime,
  step = 30
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime12Hour = (time24: string): string => {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const generateTimeOptions = (): { value: string; display: string }[] => {
    const times: { value: string; display: string }[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += step) {
        const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Check if time is within allowed range
        if (minTime && timeValue < minTime) continue;
        if (maxTime && timeValue > maxTime) continue;
        
        const displayTime = formatTime12Hour(timeValue);
        times.push({ value: timeValue, display: displayTime });
      }
    }
    
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = (timeValue: string) => {
    setSelectedTime(timeValue);
    onChange(timeValue);
    setIsOpen(false);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const scrollToSelectedTime = () => {
    if (listRef.current && selectedTime) {
      const selectedIndex = timeOptions.findIndex(option => option.value === selectedTime);
      if (selectedIndex >= 0) {
        const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen && selectedTime) {
      setTimeout(scrollToSelectedTime, 100);
    }
  }, [isOpen]);

  const getCurrentTimeDisplay = (): string => {
    return selectedTime ? formatTime12Hour(selectedTime) : '';
  };

  const getQuickTimeOptions = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const quickTimes = [];

    // Add some popular times
    const popularTimes = ['09:00', '12:00', '15:00', '18:00', '20:00'];
    
    for (const time of popularTimes) {
      const [hour] = time.split(':').map(Number);
      if (hour > currentHour || !minTime || time >= minTime) {
        if (!maxTime || time <= maxTime) {
          quickTimes.push({
            value: time,
            display: formatTime12Hour(time),
            label: hour === 9 ? 'Morning' : hour === 12 ? 'Noon' : hour === 15 ? 'Afternoon' : hour === 18 ? 'Evening' : 'Night'
          });
        }
      }
    }

    return quickTimes;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          isDarkTheme ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={getCurrentTimeDisplay()}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly
          className={`
            w-full px-4 py-3 pr-12
            border rounded-lg text-sm cursor-pointer
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isDarkTheme
              ? 'bg-black/70 text-white placeholder-gray-400 border-gold/30 focus:border-gold focus:ring-gold/20'
              : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-gold focus:ring-gold/20'
            }
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : ''
            }
            ${isFocused && !error
              ? isDarkTheme 
                ? 'border-gold shadow-lg shadow-gold/20' 
                : 'border-gold shadow-lg shadow-gold/10'
              : ''
            }
            ${className}
          `}
        />
        
        {/* Clock Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className={`w-5 h-5 ${isDarkTheme ? 'text-gold' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Time Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`
              absolute top-full left-0 right-0 mt-2 z-50
              rounded-xl shadow-2xl border
              backdrop-blur-xl max-h-72 overflow-hidden
              ${isDarkTheme
                ? 'bg-black/95 border-gold/30 shadow-black/50'
                : 'bg-white/95 border-gray-200 shadow-gray-500/20'
              }
            `}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Quick Time Options */}
            <div className="p-4 border-b border-gray-700">
              <h4 className={`text-xs font-medium mb-3 ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Quick Select
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {getQuickTimeOptions().map((quickTime) => (
                  <motion.button
                    key={quickTime.value}
                    type="button"
                    onClick={() => handleTimeSelect(quickTime.value)}
                    className={`
                      px-3 py-2 text-xs rounded-lg transition-all duration-150
                      ${selectedTime === quickTime.value
                        ? 'bg-gold text-black font-bold'
                        : isDarkTheme
                          ? 'bg-gray-800 text-gray-300 hover:bg-gold/20 hover:text-gold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gold/10 hover:text-gold'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="font-medium">{quickTime.display}</div>
                    <div className={`text-xs opacity-70 ${
                      selectedTime === quickTime.value ? 'text-black' : ''
                    }`}>
                      {quickTime.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* All Time Options */}
            <div 
              ref={listRef}
              className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/30"
            >
              {timeOptions.map((timeOption, index) => (
                <motion.button
                  key={timeOption.value}
                  type="button"
                  onClick={() => handleTimeSelect(timeOption.value)}
                  className={`
                    w-full px-4 py-3 text-left transition-all duration-150
                    flex items-center justify-between
                    ${selectedTime === timeOption.value
                      ? 'bg-gold text-black font-bold'
                      : isDarkTheme
                        ? 'text-white hover:bg-gold/10 hover:text-gold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-sm">{timeOption.display}</span>
                  {selectedTime === timeOption.value && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-black"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between p-3 border-t border-gray-700">
              <span className={`text-xs ${
                isDarkTheme ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {timeOptions.length} times available
              </span>
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  isDarkTheme
                    ? 'text-gray-400 hover:bg-gray-800'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs mt-1 leading-tight"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedTimePicker; 