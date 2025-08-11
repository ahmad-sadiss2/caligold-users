"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Car, Star, Shield, Clock } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import EnhancedTimePicker from "./EnhancedTimePicker"
import PlacesAutocomplete from "./PlacesAutocomplete"
import { phoneValidation } from "@/lib/utils"

export default function EnhancedHero() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickup: "",
    dropoff: "",
    passengers: "",
    vehicle: "",
    date: "",
    time: "",
    pets: false,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    let newValue = type === 'checkbox' ? checked : value
    
    // Handle phone number formatting
    if (name === 'phone') {
      newValue = phoneValidation.formatAmericanPhone(value)
      
      // Clear error when user starts typing
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: '' }))
      }
    }
    
    setFormData({ ...formData, [name]: newValue })
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.pickup.trim()) newErrors.pickup = 'Pickup location is required'
    if (!formData.dropoff.trim()) newErrors.dropoff = 'Drop-off location is required'
    if (!formData.passengers) newErrors.passengers = 'Number of passengers is required'
    if (!formData.vehicle) newErrors.vehicle = 'Vehicle type is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.time) newErrors.time = 'Time is required'

    // Phone validation using our American phone validation
    const phoneError = phoneValidation.getPhoneErrorMessage(formData.phone)
    if (phoneError) {
      newErrors.phone = phoneError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Handle form submission here
    // Form submitted successfully
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Gradient Instead of Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-1 h-1 bg-gold rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-gold rounded-full animate-pulse delay-500" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        {/* Trust Indicators */}
        <div className="flex justify-center items-center space-x-8 mb-8 text-white/60">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-gold fill-gold" />
            <span className="text-sm">5-Star Service</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-gold" />
            <span className="text-sm">Licensed & Insured</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gold" />
            <span className="text-sm">24/7 Available</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-gold text-lg font-medium tracking-wider uppercase">Premium Transportation</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Your Ride. Your Way.
            <br />
            <span className="text-gold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
              Always Gold.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            Airport • Events • Errands • Pet Friendly – No Extra Fees
          </p>
          <div className="flex justify-center items-center space-x-4 text-white/70 text-sm">
            <span>✓ No Hidden Fees</span>
            <span>✓ Pet Friendly</span>
            <span>✓ Professional Drivers</span>
          </div>
        </div>

        {/* Enhanced Booking Form */}
        <Card className="max-w-5xl mx-auto bg-white/95 backdrop-blur-lg shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gold to-yellow-400 p-1">
            <div className="bg-white rounded-xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-black mb-2">Book Your Premium Ride</h3>
                  <p className="text-gray-600">Experience luxury transportation at its finest</p>
                </div>

                <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`border-gray-300 h-12 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                        errors.name ? 'border-red-500 focus:border-red-400' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-black font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`border-gray-300 h-12 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold ${
                        errors.phone ? 'border-red-500 focus:border-red-400' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-black font-medium">
                      Passengers
                    </Label>
                    <Select
                      value={formData.passengers}
                      onValueChange={(value) => setFormData({ ...formData, passengers: value })}
                    >
                      <SelectTrigger className="border-gray-300 h-12 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold">
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 50}, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Passenger' : 'Passengers'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2" style={{ position: 'relative', zIndex: 10 }}>
                    <Label htmlFor="pickup" className="text-black font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gold" />
                      Pickup Location
                    </Label>
                    <PlacesAutocomplete
                      value={formData.pickup}
                      onChange={(value) => setFormData({ ...formData, pickup: value })}
                      placeholder="Enter pickup address or airport code"
                      className="h-12 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                      isDarkTheme={false}
                    />
                  </div>

                  <div className="space-y-2" style={{ position: 'relative', zIndex: 10 }}>
                    <Label htmlFor="dropoff" className="text-black font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gold" />
                      Drop-off Location
                    </Label>
                    <PlacesAutocomplete
                      value={formData.dropoff}
                      onChange={(value) => setFormData({ ...formData, dropoff: value })}
                      placeholder="Enter destination address"
                      className="h-12 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold"
                      isDarkTheme={false}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle" className="text-black font-medium flex items-center">
                      <Car className="w-4 h-4 mr-2 text-gold" />
                      Vehicle Type
                    </Label>
                    <Select
                      value={formData.vehicle}
                      onValueChange={(value) => setFormData({ ...formData, vehicle: value })}
                    >
                      <SelectTrigger className="border-gray-300 h-12 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold">
                        <SelectValue placeholder="Choose vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-black font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gold" />
                      Pickup Date
                    </Label>
                    <DatePicker
                      value={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                      placeholder="Select pickup date"
                      minDate={new Date()}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-black font-medium flex items-center">
                      <span className="mr-2">🕐</span>
                      Pickup Time
                    </Label>
                    <EnhancedTimePicker
                      value={formData.time}
                      onChange={(time) => setFormData({ ...formData, time })}
                      placeholder="Select pickup time"
                      isDarkTheme={false}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-8 p-4 bg-gold/10 rounded-lg">
                  <input
                    type="checkbox"
                    id="pets"
                    checked={formData.pets}
                    onChange={(e) => setFormData({ ...formData, pets: e.target.checked })}
                    className="rounded border-gray-300 w-5 h-5 text-gold focus:ring-gold"
                  />
                  <Label htmlFor="pets" className="text-black font-medium">
                    Traveling with pets? (No extra charge!)
                  </Label>
                </div>

                <Button 
                  type="submit"
                  className="bg-gold text-black hover:bg-gold/90 text-lg px-8 py-3 rounded-lg font-bold shadow"
                >
                  BOOK NOW
                </Button>

                <p className="text-center text-gray-500 text-sm mt-4">
                  Free cancellation up to 24 hours before your ride
                </p>
                </form>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
