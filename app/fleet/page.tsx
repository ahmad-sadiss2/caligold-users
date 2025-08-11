"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "../../components/header";
import Footer from "../../components/footer";
import WhatsAppButton from "../../components/whatsapp-button";
import { api, Vehicle, VehiclePageResponse } from "../../lib/api";
import { getImageUrl } from "../../lib/utils";

const filters = [
  { label: "All", value: "all" },
  { label: "Sedan", value: "SEDAN" },
  { label: "SUV", value: "SUV" },
  { label: "Van", value: "VAN" },
  { label: "Electric", value: "ELECTRIC" },
  { label: "Luxury", value: "LUXURY" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: "easeOut" as const,
    },
  }),
};

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(6); // 6 vehicles per page

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, activeFilter]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all vehicles for the current page
      const response: VehiclePageResponse = await api.vehicles.getAll(currentPage, pageSize);
      
      // Filter vehicles based on active filter
      let filteredVehicles = response.content;
      if (activeFilter !== "all") {
        filteredVehicles = response.content.filter(vehicle => vehicle.type === activeFilter);
      }
      
      setVehicles(response.content);
      setFilteredVehicles(filteredVehicles);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterValue: string) => {
    setActiveFilter(filterValue);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of fleet section
    const fleetSection = document.getElementById('fleet-grid');
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`px-3 py-2 mx-1 rounded-lg font-semibold transition-colors ${
          currentPage === 0
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500"
        }`}
      >
        ← Previous
      </button>
    );

    // First page
    if (startPage > 0) {
      pages.push(
        <button
          key="first"
          onClick={() => handlePageChange(0)}
          className="px-3 py-2 mx-1 rounded-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 1) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg font-semibold transition-colors ${
            currentPage === i
              ? "bg-gradient-to-r from-gold to-yellow-400 text-black drop-shadow-gold"
              : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages - 1)}
          className="px-3 py-2 mx-1 rounded-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`px-3 py-2 mx-1 rounded-lg font-semibold transition-colors ${
          currentPage === totalPages - 1
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500"
        }`}
      >
        Next →
      </button>
    );

    return (
      <motion.div
        className="flex justify-center items-center mt-12 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap justify-center items-center gap-2">
          {pages}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-16 pb-16">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-lg text-gray-300">Loading our diverse fleet of vehicles...</p>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-16 pb-16">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <p className="text-lg text-red-400 mb-4">{error}</p>
              <button 
                onClick={fetchVehicles}
                className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16 pb-16">
        {/* Hero Section */}
        <section className="relative h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury car hero"
            fill
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
          <div className="relative z-10 flex flex-col items-center justify-center w-full">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-gold drop-shadow-gold text-center mb-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Our Premium Fleet
            </motion.h1>
            <motion.p
              className="text-lg md:text-2xl text-white text-center max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Choose from our diverse selection of vehicles for every occasion. From economical sedans to premium luxury vehicles—comfort, style, and safety guaranteed.
            </motion.p>
          </div>
        </section>

        {/* Filter Bar */}
        <motion.section
          className="max-w-6xl mx-auto px-4 mt-[-40px] mb-10 relative z-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <div className="flex flex-wrap gap-4 justify-center bg-black/80 rounded-xl shadow-lg py-4 px-6 border border-gold/20 backdrop-blur">
            {filters.map((filter, i) => (
              <motion.button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={`px-5 py-2 rounded-full font-semibold transition-colors border-none focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 shadow ${
                  activeFilter === filter.value
                    ? "bg-gradient-to-r from-gold to-yellow-400 text-black drop-shadow-gold"
                    : "text-white bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                }`}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Fleet Grid */}
        <section id="fleet-grid" className="max-w-6xl mx-auto px-4">
          {/* Results Info */}
          <div className="text-center mb-8">
            <p className="text-gray-300">
              Showing {filteredVehicles.length} of {totalElements} vehicles
              {activeFilter !== "all" && ` in ${activeFilter} category`}
            </p>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-300">No vehicles found for the selected filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredVehicles.map((vehicle, i) => (
                  <motion.div
                    key={vehicle.id}
                    className="group bg-gradient-to-br from-[#181818] via-black to-[#23210e] rounded-2xl shadow-xl overflow-hidden border border-gold/30 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 relative"
                    tabIndex={0}
                    aria-label={vehicle.name}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                  >
                    <div className="relative w-full h-52 md:h-60 overflow-hidden">
                      <Image
                        src={getImageUrl(vehicle.imageUrl) || "/placeholder.jpg"}
                        alt={vehicle.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      {vehicle.isFeatured && (
                        <div className="absolute top-4 right-4 bg-gold text-black px-3 py-1 rounded-full text-sm font-bold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gold mb-1 text-center drop-shadow-gold">{vehicle.name}</h2>
                        <div className="flex justify-center gap-4 mb-2 text-sm text-gray-300">
                          <span>{vehicle.year}</span>
                          <span className="px-2">•</span>
                          <span>{vehicle.type}</span>
                        </div>
                        <div className="text-center mb-3">
                          <p className="text-sm text-gray-400 mb-2">{vehicle.description}</p>
                          <div className="flex justify-center gap-4 text-xs text-gray-500">
                            <span>👥 {vehicle.passengerCapacity} passengers</span>
                            <span>💼 {vehicle.luggageCapacity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex justify-center gap-4 mb-2">
                          <span className="inline-block bg-gradient-to-r from-gold to-yellow-400 text-black font-bold px-3 py-1 rounded text-sm">
                            ${vehicle.pricePerDay}/day
                          </span>
                          <span className="inline-block bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold px-3 py-1 rounded text-sm">
                            ${vehicle.pricePerHour}/hr
                          </span>
                        </div>
                        {vehicle.features && vehicle.features.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-400 mb-1">Features:</p>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {vehicle.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                              {vehicle.features.length > 3 && (
                                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                  +{vehicle.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </section>

        {/* Why Choose Our Fleet */}
        <motion.section
          className="max-w-6xl mx-auto px-4 mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <div className="bg-gradient-to-r from-gold/10 via-black to-gold/10 rounded-2xl p-10 text-center border border-gold/30 shadow-xl">
            <motion.h3
              className="text-3xl font-extrabold text-gold drop-shadow-gold mb-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Why Choose Our Fleet?
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                >
                  {i === 0 && (
                    <>
                      <span className="inline-block mb-2">
                        <svg className="w-10 h-10 text-gold drop-shadow-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
                      </span>
                      <h4 className="font-bold text-lg text-white mb-1">Luxury & Comfort</h4>
                      <p className="text-gray-300 text-sm">Top-tier vehicles with plush interiors and advanced features for a first-class experience.</p>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <span className="inline-block mb-2">
                        <svg className="w-10 h-10 text-gold drop-shadow-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5-2 4-2 4 2 4 2" /></svg>
                      </span>
                      <h4 className="font-bold text-lg text-white mb-1">Professional Drivers</h4>
                      <p className="text-gray-300 text-sm">Our chauffeurs are experienced, courteous, and dedicated to your safety and satisfaction.</p>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <span className="inline-block mb-2">
                        <svg className="w-10 h-10 text-gold drop-shadow-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="10" x="3" y="7" rx="2" /><path d="M7 7V5a5 5 0 0 1 10 0v2" /></svg>
                      </span>
                      <h4 className="font-bold text-lg text-white mb-1">Immaculate Cleanliness</h4>
                      <p className="text-gray-300 text-sm">Every vehicle is meticulously cleaned and sanitized before each ride for your comfort and peace of mind.</p>
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <span className="inline-block mb-2">
                        <svg className="w-10 h-10 text-gold drop-shadow-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" /><path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" /></svg>
                      </span>
                      <h4 className="font-bold text-lg text-white mb-1">Reliability & Safety</h4>
                      <p className="text-gray-300 text-sm">All vehicles undergo regular maintenance and safety inspections to ensure your journey is always secure.</p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}