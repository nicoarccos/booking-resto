"use client";
import { useState, useEffect } from "react";
import SlotGrid from "./SlotGrid";

interface AvailableSlot {
  id: number;
  date: string;
  day: string;
  time_slot: string;
  booked: boolean;
}

interface AddAppointmentProps {
  selectedDate: string;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ selectedDate }) => {
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [service, setService] = useState("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;

      try {
        const response = await fetch(`/api/appointments?date=${selectedDate}`);
        const result = await response.json();

        if (response.ok) {
          setAvailableSlots(result.schedules || []);
        } else {
          console.error("Error fetching available slots:", result.error);
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Unexpected error fetching available slots:", error);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!selectedSlot) {
      
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email,
          customer_name,
          notes,
          service,
          schedule_id: selectedSlot.id,
        }),
      });

      const result = await response.json();
      setResponseMessage(result.message);

      if (response.ok) {
        alert("Appointment added successfully");
        setAvailableSlots((prev) =>
          prev.map((slot) =>
            slot.id === selectedSlot.id ? { ...slot, booked: true } : slot
          )
        );
        setCustomerEmail("");
        setCustomerName("");
        setNotes("");
        setService("");
        setSelectedSlot(null);
      } else {
        console.error("Error adding appointment:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setResponseMessage("Unexpected error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-xl font-semibold text-green-700 text-center mb-4">
          Complete the following information to make an appointment
        </h1>
        <div className="space-y-3">
          <input
            type="email"
            value={customer_email}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Enter customer email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
          />
          <input
            type="text"
            value={customer_name}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes (optional)"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
          />
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Enter service"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
          />
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-medium text-gray-700 text-center mb-2">
            Available Slots for {selectedDate}
          </h2>
          <SlotGrid
            slots={availableSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add Appointment
        </button>
        {responseMessage && (
          <p className="text-center text-sm text-gray-600 mt-2">{responseMessage}</p>
        )}
      </div>
    </div>
  );
};

export default AddAppointment;
