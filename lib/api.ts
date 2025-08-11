// API Configuration and Service Layer
import { config } from './config';

const API_BASE_URL = config.api.baseUrl;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Booking Types
export interface BookingRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime?: string;
  passengerCount: number;
  isRoundTrip: boolean;
  specialRequests?: string;
}

export interface BookingResponse {
  bookingReference: string;
  status: string;
  message: string;
}

// Contact Types
export interface ContactRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
}

// Vehicle Types
export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  pricePerDay: number;
  pricePerHour: number;
  passengerCapacity: number;
  luggageCapacity: string;
  description: string;
  imageUrl: string;
  additionalImages: string[];
  features: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePageResponse {
  content: Vehicle[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

// Service Types
export interface Service {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  iconEmoji: string;
  imageUrl?: string;
  basePrice: number;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// FAQ Types
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  iconEmoji: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Page Content Types
export interface PageContent {
  id: number;
  pageName: string;
  title: string;
  content: string;
  metaDescription?: string;
  isActive: boolean;
}

// Homepage Types
export interface HomepageContent {
  features: Feature[];
  reviews: Review[];
  serviceAreas: ServiceArea[];
  statistics: Statistics;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaTitle: string;
  ctaSubtitle: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface Review {
  id: number;
  customerName: string;
  customerLocation: string;
  reviewText: string;
  rating: number;
  serviceType: string;
  imageUrl?: string;
  createdAt: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface ServiceArea {
  id: number;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  cities: string[];
  airports: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface Statistics {
  totalCustomers: number;
  totalBookings: number;
  totalVehicles: number;
  totalServiceAreas: number;
  totalAirports: number;
  totalCities: number;
  averageRating: number;
  totalReviews: number;
}

// API Client Class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Booking API
  async submitBooking(booking: BookingRequest): Promise<ApiResponse<BookingResponse>> {
    return this.request<ApiResponse<BookingResponse>>('/public/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  // Contact API
  async submitContact(contact: ContactRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/public/contact', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  // Vehicle API
  async getAvailableVehicles(page: number = 0, size: number = 20): Promise<VehiclePageResponse> {
    return this.request<VehiclePageResponse>(`/public/vehicles?page=${page}&size=${size}`);
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    return this.request<Vehicle[]>('/public/vehicles/featured');
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    return this.request<Vehicle>(`/public/vehicles/${id}`);
  }

  // Service API
  async getActiveServices(): Promise<Service[]> {
    return this.request<Service[]>('/public/services');
  }

  async getServiceById(id: number): Promise<Service> {
    return this.request<Service>(`/public/services/${id}`);
  }

  // FAQ API
  async getActiveFAQs(): Promise<FAQ[]> {
    return this.request<FAQ[]>('/public/faqs');
  }

  // Page Content API
  async getPageContent(pageName: string): Promise<PageContent> {
    return this.request<PageContent>(`/public/content/${pageName}`);
  }

  // Homepage API
  async getHomepageContent(): Promise<HomepageContent> {
    return this.request<HomepageContent>('/public/homepage');
  }

  async getFeatures(): Promise<Feature[]> {
    return this.request<Feature[]>('/public/features');
  }

  async getCustomerReviews(): Promise<Review[]> {
    return this.request<Review[]>('/public/reviews');
  }

  async getServiceAreas(): Promise<ServiceArea[]> {
    return this.request<ServiceArea[]>('/public/service-areas');
  }

  async getCompanyStatistics(): Promise<Statistics> {
    return this.request<Statistics>('/public/statistics');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions for common API operations
export const api = {
  // Booking operations
  booking: {
    submit: (data: BookingRequest) => apiClient.submitBooking(data),
  },

  // Contact operations
  contact: {
    submit: (data: ContactRequest) => apiClient.submitContact(data),
  },

  // Vehicle operations
  vehicles: {
    getAll: (page?: number, size?: number) => apiClient.getAvailableVehicles(page, size),
    getFeatured: () => apiClient.getFeaturedVehicles(),
    getById: (id: number) => apiClient.getVehicleById(id),
  },

  // Service operations
  services: {
    getAll: () => apiClient.getActiveServices(),
    getById: (id: number) => apiClient.getServiceById(id),
  },

  // FAQ operations
  faqs: {
    getAll: () => apiClient.getActiveFAQs(),
  },

  // Page content operations
  content: {
    getByPage: (pageName: string) => apiClient.getPageContent(pageName),
  },

  // Homepage operations
  homepage: {
    getContent: () => apiClient.getHomepageContent(),
    getFeatures: () => apiClient.getFeatures(),
    getReviews: () => apiClient.getCustomerReviews(),
    getServiceAreas: () => apiClient.getServiceAreas(),
    getStatistics: () => apiClient.getCompanyStatistics(),
  },

  // Direct API methods
  getCustomerReviews: () => apiClient.getCustomerReviews(),
  getFeatures: () => apiClient.getFeatures(),
  getServiceAreas: () => apiClient.getServiceAreas(),
  getCompanyStatistics: () => apiClient.getCompanyStatistics(),
};

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Response validation utilities
export const validateApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new ApiError(response.message || 'API request failed');
  }
  return response.data as T;
}; 