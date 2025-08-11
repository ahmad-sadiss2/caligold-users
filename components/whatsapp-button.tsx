"use client";

import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  return (
    <motion.a
              href="https://wa.me/16574624945"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      title="Chat with us on WhatsApp"
    >
      <div className="text-2xl">💬</div>
    </motion.a>
  );
};

export default WhatsAppButton;