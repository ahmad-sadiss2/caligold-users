"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { api, Vehicle } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export default function ChooseYourRide() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.vehicles.getAll(0, 6); // Get first 6 vehicles to show more variety
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
      <section id="services" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your <span className="text-gold">Ride</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">Van, SUV or Sedan – Pick What Fits Your Trip</p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-lg text-white/80">Loading our diverse fleet of vehicles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="text-gold">Ride</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">Sedan, SUV, Van, Electric, or Luxury – Pick What Fits Your Trip</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <Card key={vehicle.id} className="bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={getImageUrl(vehicle.imageUrl) || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">{vehicle.name}</h3>
                <p className="text-gray-600 mb-4">{vehicle.description}</p>
                <ul className="space-y-2 mb-6">
                  {vehicle.features && vehicle.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gold rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gold text-black hover:bg-gold/90">Book {vehicle.name}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
