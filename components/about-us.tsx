import { MapPin, Clock, Shield, Award } from "lucide-react"

const serviceAreas = ["Los Angeles", "Orange County", "San Diego", "Riverside"]

const services = [
  {
    icon: MapPin,
    title: "Airport Rides",
    description: "LAX, SAN, ONT, and Long Beach airports",
  },
  {
    icon: Clock,
    title: "Events & Parties",
    description: "Professional transportation for special occasions",
  },
  {
    icon: Shield,
    title: "Personal Errands",
    description: "Reliable rides for your daily needs",
  },
  {
    icon: Award,
    title: "VIP/Private Rides",
    description: "Premium service for discerning clients",
  },
]

export default function AboutUs() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Gradient Instead of Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      <div className="absolute inset-0 bg-black/85" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block mb-4">
              <span className="text-gold text-lg font-medium tracking-wider uppercase">Our Story</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-gold">CALI GOLD DRIVE</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              We are a Southern California-based private ride service, offering premium, simple, and elegant transportation with no hidden fees – even if you're traveling with pets!
            </p>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Our mission is to provide gold-level service that exceeds expectations while maintaining transparent
              pricing and professional standards. Whether you need airport transportation, event rides, or help with
              daily errands, we're here to serve you with excellence.
            </p>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gold mb-6">Service Areas</h3>
              <div className="grid grid-cols-2 gap-4">
                {serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center text-white bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="w-3 h-3 bg-gold rounded-full mr-3" />
                    <span className="font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gold/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gold/20 rounded-lg mb-4">
                  <service.icon className="w-6 h-6 text-gold" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
