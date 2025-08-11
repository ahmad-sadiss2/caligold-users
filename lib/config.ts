// Application Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.caligolddrive.com/api',
    timeout: 10000,
  },

  // Frontend Configuration
  app: {
    name: 'CALI GOLD DRIVE',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description: 'Premium ride service across Southern California',
  },

  // Contact Information
  contact: {
    phone: '657-462-4945',
    whatsapp: '16574624945',
    email: 'info@caligolddrive.com',
    instagram: '@caligolddrive',
    website: 'www.caligolddrive.com',
  },

  // Service Areas
  serviceAreas: [
    'Los Angeles',
    'Orange County', 
    'San Diego',
    'Riverside'
  ],

  // Features
  features: [
    'Pet Friendly',
    'Airport Rides',
    'Luxury Fleet',
    'Gold Service'
  ],

  // Social Media Links
  social: {
    whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '16574624945'}`,
    instagram: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM || 'caligolddrive'}`,
    phone: `tel:${process.env.NEXT_PUBLIC_PHONE || '6574624945'}`,
  },

  // Booking Configuration
  booking: {
    maxPassengers: 8,
    minAdvanceNotice: 1, // hours
    supportedAirports: ['LAX', 'SAN', 'SNA', 'ONT', 'LGB'],
  },

  // UI Configuration
  ui: {
    theme: {
      primary: '#FFD700', // Gold
      secondary: '#000000', // Black
      accent: '#FFA500', // Orange
    },
    animations: {
      duration: 0.3,
      easing: 'easeInOut',
    },
  },
};

// Helper functions
export const formatPhone = (phone: string) => {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

export const formatWhatsApp = (phone: string) => {
  return `1${phone.replace(/\D/g, '')}`;
};

export const getServiceAreaText = () => {
  return config.serviceAreas.join(', ');
};

export const getWhatsAppUrl = (message?: string) => {
  const baseUrl = config.social.whatsapp;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
}; 