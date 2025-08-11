"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  isDarkTheme?: boolean;
}

const EnhancedDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  error,
  minDate,
  maxDate,
  disabled = false,
  required = false,
  label,
  isDarkTheme = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate || minDate || new Date()
  );
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Force English locale
  const locale = 'en-US';

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
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

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';
    
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatInputDate = (date: Date | null): string => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(formatInputDate(date));
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate ? date.toDateString() === selectedDate.toDateString() : false;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
          value={selectedDate ? formatDisplayDate(selectedDate) : ''}
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
        
        {/* Calendar Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg 
            className={`w-5 h-5 ${isDarkTheme ? 'text-gold' : 'text-gray-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`
              absolute top-full left-0 right-0 mt-2 z-50
              rounded-xl shadow-2xl border p-4
              backdrop-blur-xl
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
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkTheme 
                    ? 'hover:bg-gold/20 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h3 className={`font-semibold ${isDarkTheme ? 'text-gold' : 'text-gray-900'}`}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkTheme 
                    ? 'hover:bg-gold/20 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdayNames.map((day) => (
                <div
                  key={day}
                  className={`text-center text-xs font-medium py-2 ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((date, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => date && !isDateDisabled(date) && handleDateSelect(date)}
                  disabled={!date || isDateDisabled(date)}
                  className={`
                    p-2 text-sm rounded-lg transition-all duration-150
                    ${!date ? 'invisible' : ''}
                    ${date && isDateDisabled(date) 
                      ? isDarkTheme 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-300 cursor-not-allowed'
                      : ''
                    }
                    ${date && isSelected(date)
                      ? 'bg-gold text-black font-bold shadow-lg'
                      : date && isToday(date)
                        ? isDarkTheme
                          ? 'bg-gold/20 text-gold border border-gold/50'
                          : 'bg-gold/10 text-gold border border-gold/30'
                        : date && !isDateDisabled(date)
                          ? isDarkTheme
                            ? 'text-white hover:bg-gold/10 hover:text-gold'
                            : 'text-gray-700 hover:bg-gray-100'
                          : ''
                    }
                  `}
                  whileHover={date && !isDateDisabled(date) ? { scale: 1.1 } : {}}
                  whileTap={date && !isDateDisabled(date) ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                >
                  {date?.getDate()}
                </motion.button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between mt-4 pt-3 border-t border-gray-700">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  if (!isDateDisabled(today)) {
                    handleDateSelect(today);
                  }
                }}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  isDarkTheme
                    ? 'text-gold hover:bg-gold/20'
                    : 'text-gold hover:bg-gold/10'
                }`}
              >
                Today
              </button>
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                  isDarkTheme
                    ? 'text-gray-400 hover:bg-gray-800'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Cancel
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

export default EnhancedDatePicker; 