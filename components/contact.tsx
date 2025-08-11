import { Phone, MessageCircle, Instagram, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="text-gold text-lg font-bold bg-black/80 px-6 py-2 rounded shadow">
            Premium Service, Every Time – Because You Deserve It
          </span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Ride <span className="text-gold">Premium</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book in 60 Seconds – Ride in Style All Day. Contact us now for your premium transportation needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <Phone className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Available 24/7</p>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent">
                (657) 562-4945
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Quick booking</p>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent">
                Message Us
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <Instagram className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Instagram</h3>
              <p className="text-gray-600 mb-4">@caligolddrivellc</p>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent">
                Follow Us
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-full mb-4">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Website</h3>
              <p className="text-gray-600 mb-4">caligolddrive.com</p>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent">
                caligolddrive.com
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-black rounded-lg p-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Premium Service, Every Time – Because You Deserve It
          </h3>
          <p className="text-white/80 mb-6">Clean Cars. Respectful Drivers. No Surprises.</p>
          <Link href="/">
            <Button className="bg-gold text-black hover:bg-gold/90 text-lg px-8 py-3">BOOK YOUR RIDE NOW</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
