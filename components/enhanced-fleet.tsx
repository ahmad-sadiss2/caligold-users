"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Luggage, Star, ArrowRight } from "lucide-react"
import { api, Vehicle } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export default function EnhancedFleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.vehicles.getAll(0, 9); // Get first 9 vehicles to show more variety
        setVehicles(response.content);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Choose Your <span className="text-gold">Ride</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Van, SUV or Sedan – Pick What Fits Your Trip
            </p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading our diverse fleet of vehicles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23FFD700' fillOpacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Choose Your <span className="text-gold">Ride</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Sedan, SUV, Van, Electric, or Luxury – Pick What Fits Your Trip
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From economical sedans to premium luxury vehicles, we have the perfect ride for every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {vehicles.map((vehicle, index) => (
            <Card
              key={vehicle.id}
              className={`bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group relative ${
                vehicle.isFeatured ? "ring-2 ring-gold" : ""
              }`}
            >
              {vehicle.isFeatured && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-gold text-black text-sm font-bold px-3 py-1 rounded-full flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={getImageUrl(vehicle.imageUrl) || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-black">{vehicle.name}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gold">${vehicle.pricePerDay}</div>
                    <div className="text-sm text-gray-500">Starting price</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{vehicle.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 text-gold mr-2" />
                    <span className="text-sm">{vehicle.passengerCapacity} passengers</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Luggage className="w-5 h-5 text-gold mr-2" />
                    <span className="text-sm">{vehicle.luggageCapacity}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  {vehicle.features && vehicle.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gold rounded-full mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-gradient-to-r from-gold to-yellow-400 text-black hover:from-gold/90 hover:to-yellow-400/90 font-bold py-3 rounded-lg group/btn">
                  <span>Book {vehicle.name}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-gold/20">
            <h3 className="text-2xl font-bold text-white mb-4">All Vehicles Include</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white/80">
              <div className="text-center">
                <div className="text-gold text-2xl mb-2">✓</div>
                <div className="text-sm">Professional Driver</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl mb-2">✓</div>
                <div className="text-sm">Climate Control</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl mb-2">✓</div>
                <div className="text-sm">Phone Chargers</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl mb-2">✓</div>
                <div className="text-sm">Bottled Water</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
