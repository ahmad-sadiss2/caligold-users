"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import WhatsAppButton from "../../components/whatsapp-button";
import { api } from "../../lib/api";
import { Service } from "../../lib/api";

// Default fallback services in case API fails
const defaultServices = [
  {
    id: 1,
    title: "Airport Transfers",
    description: "Reliable and punctual private transfers to and from LAX, SAN, SNA, ONT, and Long Beach airports. We track your flight and adjust pickup times accordingly.",
    shortDescription: "Reliable airport pickup and drop-off",
    iconEmoji: "✈️",
    imageUrl: "/assets/services/service-airport-transfer.jpg",
    basePrice: 75,
    features: ["Flight tracking", "Meet and greet", "Luggage assistance"],
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: 2,
    title: "Business Transportation",
    description: "Discrete and professional transportation for business meetings, corporate events, and executive travel.",
    shortDescription: "Professional corporate travel",
    iconEmoji: "💼",
    imageUrl: "/assets/vehicles/vehicle-fallback.jpg",
    basePrice: 60,
    features: ["Professional chauffeurs", "Executive vehicles", "WiFi available"],
    isActive: true,
    isFeatured: true,
    displayOrder: 2,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: 3,
    title: "Special Events",
    description: "Arrive in style and comfort at concerts, parties, weddings, sporting events, or a night out.",
    shortDescription: "Luxury rides for special occasions",
    iconEmoji: "🎉",
    imageUrl: "/assets/vehicles/vehicle-fallback.jpg",
    basePrice: 80,
    features: ["Red carpet service", "Decorations available", "Photo opportunities"],
    isActive: true,
    isFeatured: true,
    displayOrder: 3,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: 4,
    title: "Pet-Friendly Rides",
    description: "We are 100% pet-friendly! Bring your furry companions along at no extra charge.",
    shortDescription: "Travel with your furry friends",
    iconEmoji: "🐾",
    imageUrl: "/assets/services/service-pet-friendly.jpg",
    basePrice: 55,
    features: ["No additional pet fees", "Pet-safe vehicles", "Water bowls available"],
    isActive: true,
    isFeatured: true,
    displayOrder: 4,
    createdAt: "",
    updatedAt: ""
  }
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await api.services.getAll();
        
        // Filter active services and sort by display order
        const activeServices = data
          .filter((service: Service) => service.isActive)
          .sort((a: Service, b: Service) => (a.displayOrder || 0) - (b.displayOrder || 0));
        
        if (activeServices.length > 0) {
          setServices(activeServices);
          setError(null);
        } else {
          setServices(defaultServices);
          setError('No active services found - showing default content');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services - showing default content');
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter active services and sort by display order
  const activeServices = services
    .filter(service => service.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center mb-3 bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent drop-shadow-gold">Our Services</h1>
          <p className="text-lg text-gray-200 text-center mb-14 max-w-2xl mx-auto">CALI GOLD DRIVE offers private, non-shared rides tailored to your needs.</p>
          
          {loading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-xl text-gray-300">Loading services...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 mb-8">
              <p className="text-yellow-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="group bg-gradient-to-br from-[#181818] via-black to-[#23210e] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gold/30 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 relative"
                tabIndex={0}
                aria-label={service.title}
              >
                <div className="relative w-full h-56 md:h-64 overflow-hidden">
                  <Image
                    src={
                      service.imageUrl 
                        ? service.imageUrl.startsWith('http') 
                          ? service.imageUrl 
                          : `http://45.32.74.216/api${service.imageUrl}`
                        : "/assets/vehicles/vehicle-fallback.jpg"
                    }
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                    onError={(e) => {
                                              // Service image failed to load
                      e.currentTarget.src = "/assets/vehicles/vehicle-fallback.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  {/* Service Icon */}
                  <div className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-black p-3 rounded-full text-2xl">
                    {service.iconEmoji || "🚗"}
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-gold px-3 py-1 rounded-full text-sm font-bold">
                    {service.basePrice ? `From $${service.basePrice}` : 'Contact for Price'}
                  </div>
                  
                  {/* Featured Badge */}
                  {service.isFeatured && (
                    <div className="absolute bottom-4 left-4 bg-gold text-black px-2 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <h2 className="text-2xl font-bold text-gold mb-2 text-center drop-shadow-gold">{service.title}</h2>
                  <p className="text-gray-200 text-center leading-relaxed mb-4">
                    {service.shortDescription || service.description}
                  </p>
                  
                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <div className="mt-auto">
                      <h3 className="text-sm font-semibold text-gold mb-2">Features:</h3>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-gold mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-br from-[#181818] via-black to-[#23210e] rounded-2xl p-10 text-center border border-gold/30 shadow-xl">
            <div className="flex flex-col items-center mb-4">
              <svg className="w-12 h-12 text-gold mb-2 drop-shadow-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="10" x="2" y="7" rx="2" /><path d="M7 7V5a5 5 0 0 1 10 0v2" /></svg>
              <h3 className="text-3xl font-extrabold text-gold drop-shadow-gold">Custom Transportation Needs?</h3>
            </div>
            <p className="text-gray-200 mb-7 max-w-2xl mx-auto">Don't see exactly what you're looking for? We are happy to accommodate custom transportation requests across Southern California. Contact us to discuss your specific requirements.</p>
            <a href="/contact" className="inline-block bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-8 py-3 rounded-lg shadow-lg hover:from-yellow-400 hover:to-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2">Inquire Now</a>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}