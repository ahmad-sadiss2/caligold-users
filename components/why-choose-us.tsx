"use client"

import { useEffect, useState } from "react"
import { Check, Heart, Users, Car, Shield, DollarSign, MapPin } from "lucide-react"
import { Feature } from "@/lib/api"
import { api } from "@/lib/api"

// Icon mapping for dynamic features
const iconMap: { [key: string]: any } = {
  "🐾": Heart,
  "👥": Users,
  "💳": DollarSign,
  "✈️": MapPin,
  "🛡️": Shield,
  "🚗": Car,
}

// Fallback features if API fails
const fallbackFeatures = [
  {
    id: 1,
    title: "100% Pet-Friendly",
    description: "No Extra Charges",
    icon: "🐾",
    imageUrl: "/images/pet-friendly.jpg",
    displayOrder: 1,
  },
  {
    id: 2,
    title: "Driver Choice",
    description: "Male & Female Drivers",
    icon: "👥",
    imageUrl: "/images/driver-choice.jpg",
    displayOrder: 2,
  },
  {
    id: 3,
    title: "Flexible Payment",
    description: "Multiple Options",
    icon: "💳",
    imageUrl: "/images/payment.jpg",
    displayOrder: 3,
  },
  {
    id: 4,
    title: "Flight Tracking",
    description: "No Delay Fees",
    icon: "✈️",
    imageUrl: "/images/flight-tracking.jpg",
    displayOrder: 4,
  },
  {
    id: 5,
    title: "Safety First",
    description: "Vetted Drivers",
    icon: "🛡️",
    imageUrl: "/images/safety.jpg",
    displayOrder: 5,
  },
  {
    id: 6,
    title: "Premium Fleet",
    description: "Luxury Vehicles",
    icon: "🚗",
    imageUrl: "/images/premium-fleet.jpg",
    displayOrder: 6,
  },
]

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true)
        const data = await api.getFeatures()
        setFeatures(data)
      } catch (err) {
        console.error('Error fetching features:', err)
        setError('Failed to load features')
        setFeatures(fallbackFeatures)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  const getIconComponent = (icon: string) => {
    return iconMap[icon] || Heart
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading features...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="text-gold text-lg font-bold bg-black/80 px-6 py-2 rounded shadow">
            Clean Cars. Respectful Drivers. No Surprises.
          </span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Why Choose <span className="text-gold">CALI GOLD DRIVE</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with gold-level service that puts your comfort and needs first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = getIconComponent(feature.icon)
            return (
              <div key={feature.id} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gold/20 bg-black/5">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {error && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Showing default features (backend not available)
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
