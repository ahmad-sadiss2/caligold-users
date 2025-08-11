import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to construct full image URL from backend path
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) {
    console.warn("getImageUrl: No image path provided");
    return null;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /images/, construct full URL
  if (imagePath.startsWith('/images/')) {
    const fullUrl = `${config.api.baseUrl}${imagePath}`;
    return fullUrl;
  }
  
  // If it's just a filename, construct full URL
  const fullUrl = `${config.api.baseUrl}/images/${imagePath}`;
  return fullUrl;
};

// American phone number validation and formatting utilities
export const phoneValidation = {
  // Validate American phone number format
  isValidAmericanPhone: (phone: string): boolean => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's a valid American phone number
    // Must be exactly 10 digits (without country code) or 11 digits (with +1)
    if (digitsOnly.length === 10) {
      // Area code cannot start with 0 or 1
      const areaCode = digitsOnly.substring(0, 3);
      return !areaCode.startsWith('0') && !areaCode.startsWith('1');
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      // With country code +1
      const areaCode = digitsOnly.substring(1, 4);
      return !areaCode.startsWith('0') && !areaCode.startsWith('1');
    }
    
    return false;
  },

  // Format phone number to (XXX) XXX-XXXX format
  formatAmericanPhone: (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length === 0) return '';
    
    if (digitsOnly.length <= 3) {
      return `(${digitsOnly}`;
    } else if (digitsOnly.length <= 6) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    } else if (digitsOnly.length <= 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      // Handle +1 country code
      const withoutCountryCode = digitsOnly.slice(1);
      return `+1 (${withoutCountryCode.slice(0, 3)}) ${withoutCountryCode.slice(3, 6)}-${withoutCountryCode.slice(6)}`;
    }
    
    // If more than 10 digits and doesn't start with 1, just format first 10
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  },

  // Get validation error message
  getPhoneErrorMessage: (phone: string): string => {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      return 'Phone number must have at least 10 digits';
    } else if (digitsOnly.length > 11) {
      return 'Phone number cannot have more than 11 digits';
    } else if (digitsOnly.length === 11 && !digitsOnly.startsWith('1')) {
      return 'For 11-digit numbers, must start with country code 1';
    } else if (!phoneValidation.isValidAmericanPhone(phone)) {
      const areaCode = digitsOnly.length === 10 ? digitsOnly.substring(0, 3) : digitsOnly.substring(1, 4);
      if (areaCode.startsWith('0') || areaCode.startsWith('1')) {
        return 'Area code cannot start with 0 or 1';
      }
      return 'Please enter a valid American phone number';
    }
    
    return '';
  }
};
