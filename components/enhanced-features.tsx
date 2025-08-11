import { Heart, Users, Car, Shield, DollarSign, MapPin } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Pet-Friendly – No Extra Charges",
    description: "Bring your furry friends along at no additional cost",
    highlight: "100% Pet Friendly",
  },
  {
    icon: Users,
    title: "Female & Male Drivers Available",
    description: "Request your preferred driver for maximum comfort",
    highlight: "Your Choice",
  },
  {
    icon: Car,
    title: "SUVs, Vans, and Sedans",
    description: "Choose the perfect vehicle for your needs",
    highlight: "Premium Fleet",
  },
  {
    icon: Shield,
    title: "Clean, Comfortable Rides",
    description: "Professionally maintained vehicles and vetted drivers",
    highlight: "Safety First",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees, no surprises - just honest pricing",
    highlight: "No Hidden Fees",
  },
  {
    icon: MapPin,
    title: "Serving LA, OC, San Diego & Riverside",
    description: "Comprehensive coverage across Southern California",
    highlight: "Wide Coverage",
  },
]

const stats = [
  { number: "10,000+", label: "Happy Customers" },
  { number: "5-Star", label: "Average Rating" },
  { number: "24/7", label: "Available Service" },
  { number: "4", label: "Counties Served" },
]

export default function EnhancedFeatures() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gold mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-4">
          <span className="text-gold text-lg font-bold bg-black/80 px-6 py-2 rounded shadow">
            Your Ride, Your Way – Choose Male or Female Drivers
          </span>
        </div>
        <div className="text-center mb-4">
          <span className="text-gold text-lg font-bold bg-black/80 px-6 py-2 rounded shadow">
            Need a Ride for You and Your Pet? We’ve Got You Covered!
          </span>
        </div>
        <div className="text-center mb-4">
          <span className="text-gold text-lg font-bold bg-black/80 px-6 py-2 rounded shadow">
            Errands, Events, or Everyday Rides – We Do It All
          </span>
        </div>

        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-gold text-lg font-medium tracking-wider uppercase">Premium Service</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Why Choose <span className="text-gold">CALI GOLD DRIVE</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Gold-level service no matter where you're going. Experience the difference with our premium ride service
            that puts your comfort and satisfaction first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gold/20"
            >
              <div className="absolute top-4 right-4">
                <span className="bg-gold/10 text-gold text-xs font-bold px-3 py-1 rounded-full">
                  {feature.highlight}
                </span>
              </div>

              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-gold" />
              </div>

              <h3 className="text-xl font-bold text-black mb-4 group-hover:text-gold transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">{feature.description}</p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-black rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready for Premium Service?</h3>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who chose premium transportation with no hidden fees.
              </p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-8 py-4 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                Book Your Ride Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
