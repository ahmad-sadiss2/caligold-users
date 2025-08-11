"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Place {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
  place_id?: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  error?: string;
  onPlaceSelect?: (place: Place) => void;
  isDarkTheme?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  icon?: React.ReactNode;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  error,
  onPlaceSelect,
  isDarkTheme,
  disabled = false,
  required = false,
  label,
  icon
}) => {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const requestRef = useRef<AbortController | undefined>(undefined);

  // Determine theme
  const isDark = isDarkTheme !== undefined ? isDarkTheme : 
    className.includes('bg-black') || className.includes('dark');

  // Calculate relevance score for sorting suggestions
  const getRelevanceScore = (place: Place, query: string): number => {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const displayName = place.display_name.toLowerCase();
    
    // Exact match bonus
    if (displayName.includes(lowerQuery)) {
      score += 10;
    }
    
    // Address type priorities
    if (place.type === 'house' || place.class === 'place') score += 5;
    if (place.type === 'building') score += 4;
    if (place.type === 'road') score += 3;
    if (place.type === 'postcode') score += 2;
    
    return score;
  };

  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 2 || disabled) return;

    // Create new abort controller for this request
    requestRef.current = new AbortController();
    setIsLoading(true);

    try {
      // Use our backend proxy endpoint instead of direct OpenStreetMap API
      const response = await fetch(
        `/api/places/search?` + 
        new URLSearchParams({
          q: query,
          countrycodes: 'us',
          limit: '8',
          addressdetails: '1',
          extratags: '1',
          namedetails: '1'
        }),
        {
          signal: requestRef.current.signal
        }
      );
      
      if (response.ok && !requestRef.current.signal.aborted) {
        const data = await response.json();
        // Filter and sort results for better relevance
        const filteredData = data
          .filter((place: Place) => place.display_name && place.lat && place.lon)
          .sort((a: Place, b: Place) => {
            // Prioritize exact matches and address types
            const aScore = getRelevanceScore(a, query);
            const bScore = getRelevanceScore(b, query);
            return bScore - aScore;
          });
        
        setSuggestions(filteredData);
        setShowSuggestions(filteredData.length > 0);
        setSelectedIndex(-1);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Address search error:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } finally {
      if (!requestRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [disabled, getRelevanceScore]);

  // Enhanced debounced search with abort controller
  const debouncedSearch = useCallback((query: string) => {
    // Clear previous timeout and request
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (requestRef.current) {
      requestRef.current.abort();
    }

    debounceRef.current = setTimeout(() => {
      if (query.length >= 2) {
        searchAddresses(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
      }
    }, 200);
  }, [searchAddresses]);

  useEffect(() => {
    if (hasInteracted) {
      debouncedSearch(value);
    }
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (requestRef.current) {
        requestRef.current.abort();
      }
    };
  }, [value, debouncedSearch, hasInteracted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHasInteracted(true);
    
    if (newValue.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: Place) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    setHasInteracted(false);
    setIsLoading(false); // Stop loading immediately when selection is made
    
    if (onPlaceSelect) {
      onPlaceSelect(suggestion);
    }
    
    // Return focus to input for better UX
    setTimeout(() => {
      inputRef.current?.blur();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasInteracted(true);
    if (value.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Enhanced suggestion formatting
  const formatSuggestion = (suggestion: Place) => {
    const parts = suggestion.display_name.split(', ');
    let primary = '';
    let secondary = '';
    
    if (parts.length >= 4) {
      primary = parts.slice(0, 2).join(', ');
      secondary = parts.slice(2).join(', ');
    } else if (parts.length === 3) {
      primary = parts[0];
      secondary = parts.slice(1).join(', ');
    } else {
      primary = suggestion.display_name;
    }
    
    return { primary, secondary };
  };

  // Get suggestion icon based on type
  const getSuggestionIcon = (suggestion: Place) => {
    switch (suggestion.type) {
      case 'house':
      case 'building':
        return '🏠';
      case 'road':
        return '🛣️';
      case 'city':
      case 'town':
      case 'village':
        return '🏙️';
      case 'airport':
        return '✈️';
      case 'university':
        return '🏫';
      case 'hospital':
        return '🏥';
      case 'hotel':
        return '🏨';
      default:
        return '📍';
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  const suggestionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.15 }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ zIndex: showSuggestions ? 50 : 1 }}
    >
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 
            ${icon ? 'pl-10' : 'pl-4'} 
            ${isLoading ? 'pr-12' : 'pr-4'}
            border rounded-lg text-sm 
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isDark
              ? 'bg-black/70 text-white placeholder-gray-400 border-gold/30 focus:border-gold focus:ring-gold/20'
              : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-gold focus:ring-gold/20'
            }
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : ''
            }
            ${isFocused && !error
              ? isDark 
                ? 'border-gold shadow-lg shadow-gold/20' 
                : 'border-gold shadow-lg shadow-gold/10'
              : ''
            }
            ${className}
          `}
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Loading Spinner */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 inset-y-0 flex items-center justify-center"
            >
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gold border-t-transparent shadow-sm"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, y: -10, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.2, ease: "easeOut" }
              },
              exit: { 
                opacity: 0, 
                y: -10, 
                scale: 0.95,
                transition: { duration: 0.15 }
              }
            }}
            className={`
              absolute top-full left-0 right-0 mt-2
              max-h-64 overflow-y-auto
              rounded-xl shadow-2xl border
              backdrop-blur-xl z-50
              scrollbar-thin scrollbar-thumb-gold/30
              ${isDark
                ? 'bg-black/95 border-gold/30 shadow-black/50'
                : 'bg-white/95 border-gray-200 shadow-gray-500/20'
              }
            `}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {suggestions.map((suggestion, index) => {
              const { primary, secondary } = formatSuggestion(suggestion);
              const icon = getSuggestionIcon(suggestion);
              
              return (
                <motion.div
                  key={`${suggestion.place_id || suggestion.lat}-${index}`}
                  variants={suggestionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className={`
                    px-4 py-3 cursor-pointer
                    flex items-start space-x-3
                    transition-all duration-150 ease-in-out
                    touch-manipulation select-none
                    ${index === selectedIndex
                      ? isDark
                        ? 'bg-gold/20 text-gold'
                        : 'bg-gold/10 text-gold'
                      : isDark
                        ? 'text-white hover:bg-gold/10 hover:text-gold active:bg-gold/15'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }
                    ${index === 0 ? 'rounded-t-xl' : ''}
                    ${index === suggestions.length - 1 ? 'rounded-b-xl' : ''}
                  `}

                >
                  {/* Icon */}
                  <span className="text-lg mt-0.5 flex-shrink-0">
                    {icon}
                  </span>
                  
                  {/* Address Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm leading-tight truncate">
                      {primary}
                    </div>
                    {secondary && (
                      <div className={`text-xs mt-0.5 leading-tight ${
                        index === selectedIndex
                          ? isDark ? 'text-gold/80' : 'text-gold/90'
                          : isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {secondary}
                      </div>
                    )}
                    <div className={`text-xs mt-1 ${
                      index === selectedIndex
                        ? isDark ? 'text-gold/60' : 'text-gold/70'
                        : isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {suggestion.type} • {suggestion.class}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

      {/* Help Text */}
      {!error && hasInteracted && value.length > 0 && value.length < 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Keep typing for suggestions...
        </motion.p>
      )}
    </div>
  );
};

export default PlacesAutocomplete; 