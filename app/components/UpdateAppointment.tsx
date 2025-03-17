"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface UpdateFields {
  date?: string;
  time_slot?: string;
  service?: string;
  notes?: string;
}

const services = [
  { id: 'dinner', name: 'Dinner', description: 'Fine dining experience' },
  { id: 'lunch', name: 'Lunch', description: 'Casual dining experience' },
  { id: 'special_event', name: 'Special Event', description: 'Private dining room' },
  { id: 'tasting_menu', name: 'Tasting Menu', description: "Chef's special selection" },
];

export default function UpdateAppointment() {
  const [appointmentId, setAppointmentId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!appointmentId || !customerEmail) {
      setMessage("❌ Appointment ID and Customer Email are required.");
      setLoading(false);
      return;
    }

    const updateFields: UpdateFields = {};
    if (newDate) updateFields.date = newDate;
    if (newTime) updateFields.time_slot = newTime;
    if (service) updateFields.service = service;
    if (notes) updateFields.notes = notes;

    if (Object.keys(updateFields).length === 0) {
      setMessage("❌ At least one field must be updated.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/appointments?id=${appointmentId}&customer_email=${customerEmail}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateFields),
        }
      );

      const result: { success: boolean; message?: string } = await response.json();
      if (result.success) {
        setMessage("✅ Appointment updated successfully!");
        // Reset form
        setNewDate("");
        setNewTime("");
        setService("");
        setNotes("");
      } else {
        setMessage(`❌ ${result.message || "Failed to update appointment."}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label htmlFor="newDate" className="block text-sm font-body text-text-primary mb-2">
              New Date
            </label>
            <input
              type="date"
              id="newDate"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body"
            />
          </div>

          <div>
            <label htmlFor="newTime" className="block text-sm font-body text-text-primary mb-2">
              New Time
            </label>
            <input
              type="time"
              id="newTime"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label className="block text-sm font-body text-text-primary mb-2">
            Service
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => setService(s.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-default border transition-all text-left ${
                  service === s.id
                    ? 'border-primary bg-background text-primary shadow-highlight'
                    : 'border-gray-200 hover:border-accent hover:bg-background/50'
                }`}
              >
                <div className="font-sans">{s.name}</div>
                <div className="text-sm text-text-secondary font-body">{s.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <label htmlFor="notes" className="block text-sm font-body text-text-primary mb-2">
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body min-h-[100px]"
            placeholder="Enter any special requests or notes"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading || (!appointmentId && !customerEmail)}
          className={`w-full p-4 rounded-default font-sans transition-all ${
            loading || (!appointmentId && !customerEmail)
              ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-soft hover:shadow-medium'
          }`}
          whileHover={{ scale: loading || (!appointmentId && !customerEmail) ? 1 : 1.02 }}
          whileTap={{ scale: loading || (!appointmentId && !customerEmail) ? 1 : 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Updating...
            </span>
          ) : (
            'Update Appointment'
          )}
        </motion.button>
      </form>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-default ${
            message.includes("✅")
              ? 'bg-background text-success border border-success/20'
              : 'bg-background text-error border border-error/20'
          }`}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
