"use client";
import { useState } from "react";
import MonthSection from "./MonthSection";
import { motion } from "framer-motion";
import { AvailableSlot } from "./types";

interface AddAppointmentProps {
  selectedDate: string;
  availableSlots?: AvailableSlot[];
}

const services = [
  { 
    id: 'dinner', 
    name: 'Dinner', 
    description: 'Fine dining experience',
    capacity: '2-4 people'
  },
  { 
    id: 'lunch', 
    name: 'Lunch', 
    description: 'Casual dining experience',
    capacity: '2-6 people'
  },
  { 
    id: 'special_event', 
    name: 'Special Event', 
    description: 'Private dining room',
    capacity: '8-12 people'
  },
  { 
    id: 'tasting_menu', 
    name: 'Tasting Menu', 
    description: "Chef's special selection",
    capacity: '2-8 people'
  }
];

const AddAppointment: React.FC<AddAppointmentProps> = ({ 
  selectedDate,
  availableSlots = []
}) => {
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_name, setCustomerName] = useState("");
  const [guests, setGuests] = useState("");
  const [notes, setNotes] = useState("");
  const [service, setService] = useState("");
  const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const validateForm = () => {
    if (!customer_email) {
      setResponseMessage({ type: 'error', text: 'Please enter your email address' });
      return false;
    }
    if (!customer_name) {
      setResponseMessage({ type: 'error', text: 'Please enter your name' });
      return false;
    }
    if (!guests) {
      setResponseMessage({ type: 'error', text: 'Please enter the number of guests' });
      return false;
    }
    if (!service) {
      setResponseMessage({ type: 'error', text: 'Please select a dining option' });
      return false;
    }
    if (!selectedSlot) {
      setResponseMessage({ type: 'error', text: 'Please select an available time slot' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Crear un objeto con los datos a enviar
      const appointmentData = {
        customer_email,
        customer_name,
        guests,
        notes,
        service,
        date: selectedDate,
        time: selectedSlot?.time_slot,
      };

      console.log('Sending reservation data:', appointmentData);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      // Capturar el texto de la respuesta primero
      const responseText = await response.text();
      console.log(`API Response (${response.status}):`, responseText);
      
      let result;
      try {
        // Intentar parsear como JSON
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing response as JSON:", parseError);
        throw new Error(`Respuesta no válida del servidor: ${responseText}`);
      }

      if (response.ok) {
        // Éxito - mostrar mensaje y limpiar el formulario
        setResponseMessage({ 
          type: 'success', 
          text: result.warning 
            ? `${result.warning}`
            : 'Reserva confirmada! Revisa tu correo para los detalles de confirmación.' 
        });
        setSelectedSlot(null);
        setCustomerEmail("");
        setCustomerName("");
        setGuests("");
        setNotes("");
        setService("");
        setStep(1);
      } else {
        // Error - mostrar mensaje de error del servidor
        if (result.debug?.includes('connection')) {
          setResponseMessage({ 
            type: 'error', 
            text: 'Error de conexión con el servidor. Por favor, intente nuevamente más tarde o contáctenos directamente por teléfono.' 
          });
        } else {
          setResponseMessage({ 
            type: 'error', 
            text: result.message || 'Error al hacer la reserva. Intente nuevamente.' 
          });
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setResponseMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Un error inesperado ocurrió. Intente nuevamente.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-medium rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-sans text-primary text-center mb-6">
          Make a Reservation
        </h2>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-body text-text-primary mb-2">Name</label>
                  <input
                    type="text"
                    value={customer_name}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full p-3 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-text-primary mb-2">Email</label>
                  <input
                    type="email"
                    value={customer_email}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-3 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-body text-text-primary mb-2">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="Enter number of guests"
                  className="w-full p-3 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all font-body"
                />
              </div>

              <div>
                <label className="block text-sm font-body text-text-primary mb-2">Dining Option</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setService(s.id)}
                      className={`p-4 rounded-default border transition-all text-left ${
                        service === s.id
                          ? 'border-primary bg-background text-primary shadow-highlight'
                          : 'border-gray-200 hover:border-accent hover:bg-background/50'
                      }`}
                    >
                      <div className="font-sans">{s.name}</div>
                      <div className="text-sm text-text-secondary font-body">{s.description}</div>
                      <div className="text-xs text-accent mt-1 font-body">{s.capacity}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-body text-text-primary mb-2">Special Requests</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dietary restrictions, special occasions, seating preferences..."
                  className="w-full p-3 border border-gray-200 rounded-default focus:ring-2 focus:ring-accent focus:border-accent-light transition-all min-h-[100px] font-body"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!customer_email || !customer_name || !service || !guests}
                className={`w-full p-4 rounded-default font-sans transition-all ${
                  !customer_email || !customer_name || !service || !guests
                    ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark'
                }`}
              >
                Continue to Select Time
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-sans text-text-primary text-center mb-4">
                  Select Your Preferred Time
                </h3>
                <MonthSection
                  month={new Date(selectedDate).toLocaleString('default', { month: 'long' })}
                  slots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={(slot) => setSelectedSlot(slot)}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 p-4 rounded-default font-sans border border-primary text-primary hover:bg-background transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedSlot}
                  className={`flex-1 p-4 rounded-default font-sans transition-all ${
                    isLoading || !selectedSlot
                      ? 'bg-gray-100 text-text-secondary cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Confirming...
                    </span>
                  ) : (
                    'Confirm Reservation'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {responseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-default ${
              responseMessage.type === 'success'
                ? 'bg-background text-success border border-success/20'
                : 'bg-background text-error border border-error/20'
            }`}
          >
            {responseMessage.text}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AddAppointment;
