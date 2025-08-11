"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Review } from "@/lib/api"
import { api } from "@/lib/api"
import { getImageUrl } from "@/lib/utils"

// Fallback reviews if API fails
const fallbackReviews = [
  {
    id: 1,
    customerName: "Sarah M.",
    customerLocation: "San Diego, CA",
    reviewText: "Absolutely incredible service! The Mercedes S-Class was spotless and the driver was incredibly professional. My cats were welcomed with open arms - no extra charges as promised!",
    rating: 5,
    serviceType: "Airport Transfer",
    imageUrl: "/assets/avatars/customer-marcus-t.jpg",
    createdAt: "2025-07-16T02:10:43",
    isActive: true,
    isFeatured: true
  },
  {
    id: 2,
    customerName: "Marcus T.",
    customerLocation: "Los Angeles, CA",
    reviewText: "Outstanding experience from start to finish. Picked me up from LAX right on time despite my flight being delayed. The Tesla Model X was amazing!",
    rating: 5,
    serviceType: "Airport Pickup",
    imageUrl: "/assets/avatars/customer-marcus-t.jpg",
    createdAt: "2025-07-16T02:10:43",
    isActive: true,
    isFeatured: true
  },
  {
    id: 3,
    customerName: "Christine L.",
    customerLocation: "Orange County, CA",
    reviewText: "I requested a female driver for my business meeting and they accommodated perfectly. The driver was punctual, professional, and respectful.",
    rating: 5,
    serviceType: "Business Meeting",
    imageUrl: "/assets/avatars/customer-christine-l.jpg",
    createdAt: "2025-07-16T02:10:43",
    isActive: true,
    isFeatured: true
  }
]

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentReview, setCurrentReview] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const data = await api.getCustomerReviews()
        setReviews(data)
      } catch (err) {
        setError('Failed to load reviews - using fallback data')
        setReviews(fallbackReviews)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const nextReview = () => {
    if (reviews.length > 0) {
      setDirection(1)
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }
  }

  const prevReview = () => {
    if (reviews.length > 0) {
      setDirection(-1)
      setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)
    }
  }

  const goToReview = (index: number) => {
    setDirection(index > currentReview ? 1 : -1)
    setCurrentReview(index)
  }

  useEffect(() => {
    if (reviews.length > 0) {
      const timer = setInterval(() => {
        setDirection(1)
        setCurrentReview((prev) => (prev + 1) % reviews.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [reviews])

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p 
              className="mt-4 text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Loading reviews...
            </motion.p>
          </motion.div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return (
      <section id="reviews" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-300">No reviews available</p>
          </motion.div>
        </div>
      </section>
    )
  }

  const currentReviewData = reviews[currentReview]

  return (
    <section id="reviews" className="pt-12 pb-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 relative z-10">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-yellow-400 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-300">
            Real experiences from real customers across Southern California
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentReview}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full top-0 left-0"
              >
                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gold/30 shadow-2xl">
                  <CardContent className="p-8 md:p-12">
                    {/* Service Type Badge */}
                    <motion.div 
                      className="inline-block bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {currentReviewData.serviceType}
                    </motion.div>

                    {/* Stars */}
                    <motion.div 
                      className="flex justify-center mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {[...Array(currentReviewData.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                        >
                          <Star className="w-6 h-6 fill-gold text-gold mx-1" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Review Text */}
                    <motion.blockquote 
                      className="text-xl md:text-2xl text-white mb-8 italic font-light leading-relaxed text-center"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                    >
                      "{currentReviewData.reviewText}"
                    </motion.blockquote>

                    {/* Customer Info */}
                    <motion.div 
                      className="flex items-center justify-center space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <motion.img
                        src={getImageUrl(currentReviewData.imageUrl) || "/placeholder.svg"}
                        alt={currentReviewData.customerName}
                        className="w-16 h-16 rounded-full border-2 border-gold object-cover"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
                      />
                      <motion.div 
                        className="text-left"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        <div className="text-gold font-bold text-lg">
                          {currentReviewData.customerName}
                        </div>
                        <div className="text-gray-400">
                          {currentReviewData.customerLocation}
                        </div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent backdrop-blur-sm"
                onClick={prevReview}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent backdrop-blur-sm"
                onClick={nextReview}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <motion.div 
            className="flex justify-center mt-8 space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {reviews.map((_, index) => (
              <motion.button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentReview ? "bg-gold scale-125" : "bg-gray-400 hover:bg-gray-300"
                }`}
                onClick={() => goToReview(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
              />
            ))}
          </motion.div>

          {error && (
            <motion.div 
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <p className="text-sm text-gray-400">
                Showing fallback reviews (backend not available)
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
