"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

export default function DeleteAppointment() {
  const [appointmentId, setAppointmentId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    if (!appointmentId || !customerEmail) {
      toast.error("Please provide both appointment ID and customer email.");
      return;
    }

    setIsLoading(true);

    try {
      const deleteResponse = await fetch(
        `/api/appointments?id=${appointmentId}&customer_email=${customerEmail}`,
        {
          method: "DELETE",
        }
      );

      const deleteResult = await deleteResponse.json();

      if (!deleteResponse.ok) {
        toast.error(`Error canceling appointment: ${deleteResult.message}`);
        return;
      }

      toast.success("Appointment canceled successfully!");
      setAppointmentId("");
      setCustomerEmail("");
      setShowConfirm(false);
      
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while canceling the appointment.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label htmlFor="appointmentId" className="block text-sm font-body text-text-primary mb-2">
            Appointment ID
          </label>
          <input
            type="text"
            id="appointmentId"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body"
            placeholder="Enter appointment ID"
            required
            disabled={showConfirm || isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label htmlFor="customerEmail" className="block text-sm font-body text-text-primary mb-2">
            Customer Email
          </label>
          <input
            type="email"
            id="customerEmail"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body"
            placeholder="Enter customer email"
            required
            disabled={showConfirm || isLoading}
          />
        </motion.div>

        {showConfirm ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="text-center p-6 bg-background rounded-default border border-error/20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 mx-auto mb-4 text-error"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>
              <h4 className="text-xl font-sans text-error mb-2">Are you sure?</h4>
              <p className="text-text-secondary mb-2">
                You are about to cancel your reservation.
              </p>
              <p className="text-sm text-text-secondary/70">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 p-4 rounded-default font-sans border border-gray-200 text-text-primary hover:bg-background transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                Go Back
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="flex-1 p-4 rounded-default font-sans bg-error text-white hover:bg-error-dark transition-all shadow-soft hover:shadow-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Canceling...
                  </span>
                ) : (
                  'Confirm Cancellation'
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            type="submit"
            disabled={!appointmentId || !customerEmail || isLoading}
            className={`w-full p-4 rounded-default font-sans transition-all ${
              !appointmentId || !customerEmail || isLoading
                ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
                : 'bg-error text-white hover:bg-error-dark shadow-soft hover:shadow-medium'
            }`}
            whileHover={{ scale: !appointmentId || !customerEmail || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: !appointmentId || !customerEmail || isLoading ? 1 : 0.98 }}
          >
            Cancel Appointment
          </motion.button>
        )}
      </form>
    </motion.div>
  );
}