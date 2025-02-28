"use client";

import { useState } from "react";

interface UpdateFields {
  date?: string;
  time_slot?: string;
  service?: string;
  notes?: string;
}

const UpdateAppointment = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    if (!appointmentId || !customerEmail) {
      setMessage("❌ Appointment ID and Customer Email are required.");
      setLoading(false);
      return;
    }

    // Prepare update payload
    const updateFields: UpdateFields = {};
    if (date) updateFields.date = date;
    if (timeSlot) updateFields.time_slot = timeSlot;
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
    <div className="flex flex-col items-center bg-white">
      <div className="max-w-lg w-full bg-orange-500 shadow-lg rounded-lg p-6 mt-4">
        <h2 className="text-2xl font-bold text-center text-black mb-4">
          Update Appointment
        </h2>
  
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Appointment ID"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-orange-300 focus:outline-none"
            disabled={loading}
          />
  
          <input
            type="email"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-orange-300 focus:outline-none"
            disabled={loading}
          />
  
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-orange-300 focus:outline-none"
            disabled={loading}
          />
  
          <input
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-orange-300 focus:outline-none"
            disabled={loading}
          />
  
          <input
            type="text"
            placeholder="Service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-orange-300 focus:outline-none"
            disabled={loading}
          />
  
          <textarea
            placeholder="Additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-black focus:ring-2 focus:ring-orange-300 focus:outline-none h-24"
            disabled={loading}
          />
  
          <button
            onClick={handleUpdate}
            className={`w-full py-2 rounded-md transition bg-white text-black font-semibold hover:bg-gray-200`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Appointment"}
          </button>
  
          {message && (
            <p className={`text-center mt-2 p-2 rounded-md bg-white ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default UpdateAppointment;
