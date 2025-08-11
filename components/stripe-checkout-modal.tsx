// components/stripe-checkout-modal.tsx - Stripe Checkout Modal Wrapper
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StripeCheckout, { StripeCheckoutProps } from './stripe-checkout';

interface StripeCheckoutModalProps extends StripeCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  ...checkoutProps
}) => {
  const handleSuccess = (paymentIntentId: string) => {
    checkoutProps.onSuccess(paymentIntentId);
    onClose();
  };

  const handleCancel = () => {
    checkoutProps.onCancel();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
              aria-label="Close payment modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Checkout Component */}
            <StripeCheckout
              {...checkoutProps}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StripeCheckoutModal; 