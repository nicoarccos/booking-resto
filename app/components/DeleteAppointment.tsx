
"use client";

import { useState } from "react";

const DeleteAppointment = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!appointmentId || !customerEmail) {
      setResponseMessage("❌ Please provide both appointment ID and customer email.");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");

    try {
      // DELETE request to remove the appointment
      const deleteResponse = await fetch(
        `/api/appointments?id=${appointmentId}&customer_email=${customerEmail}`,
        {
          method: "DELETE",
        }
      );

      const deleteResult = await deleteResponse.json();

      if (!deleteResponse.ok) {
        setResponseMessage(`❌ Error deleting appointment: ${deleteResult.message}`);
        setIsLoading(false);
        return;
      }

      setResponseMessage("✅ Appointment deleted successfully!");

      // ✅ Immediately reset input fields
      setAppointmentId("");
      setCustomerEmail("");

      // ⏳ Delay clearing the message for user feedback
      setTimeout(() => {
        setResponseMessage("");
      }, 4000);
      
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting the appointment.";
      setResponseMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white">
      <div className="bg-red-600 p-6 rounded-lg shadow-xl w-full max-w-lg mt-4">
        <h2 className="text-2xl font-bold text-center text-black mb-4">
          Delete Appointment
        </h2>
  
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Appointment ID"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="w-full p-2 border-2 border-white rounded-md bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
            disabled={isLoading}
          />
  
          <input
            type="email"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full p-2 border-2 border-white rounded-md bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
            disabled={isLoading}
          />
  
          <button
            onClick={handleDelete}
            className={`w-full py-2 text-black font-semibold rounded-md transition duration-200 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-200 active:bg-gray-300"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Appointment"}
          </button>
  
          {responseMessage && (
            <p
              className={`text-center mt-2 p-2 rounded-md ${
                responseMessage.includes("❌") ? "bg-white text-red-600" : "bg-white text-green-600"
              }`}
            >
              {responseMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAppointment;