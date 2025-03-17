'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckAppointments from "../components/CheckAppointment";
import DeleteAppointment from "../components/DeleteAppointment";
import FullCalendarComponent from "../components/FullCalendarComponent";
import UpdateAppointment from "../components/UpdateAppointment";

type Tab = 'book' | 'manage';

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('book');

  return (
    <div className="min-h-screen py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-sans text-primary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Reservaciones
        </motion.h1>
        <motion.p 
          className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Realiza o gestiona tus reservas de manera fácil y rápida
        </motion.p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <motion.button
            onClick={() => setActiveTab('book')}
            className={`px-8 py-3 rounded-default font-sans text-lg transition-all ${
              activeTab === 'book'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white/70 backdrop-blur-sm text-text-primary border border-gray-200 hover:border-primary'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Hacer Reserva
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('manage')}
            className={`px-8 py-3 rounded-default font-sans text-lg transition-all ${
              activeTab === 'manage'
                ? 'bg-primary text-white shadow-soft'
                : 'bg-white/70 backdrop-blur-sm text-text-primary border border-gray-200 hover:border-primary'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Gestionar Reserva
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {activeTab === 'book' ? (
          <motion.div
            key="booking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="card">
              <h2 className="text-2xl font-sans text-primary mb-6">
                Selecciona una Fecha y Hora
              </h2>
              <FullCalendarComponent />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="manage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4"
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div className="card">
                <h3 className="text-2xl font-sans text-primary mb-6">
                  Consultar Reservas
                </h3>
                <CheckAppointments />
              </div>

              <div className="space-y-8">
                <div className="card">
                  <h3 className="text-2xl font-sans text-primary mb-6">
                    Modificar Reserva
                  </h3>
                  <UpdateAppointment />
                </div>

                <div className="card">
                  <h3 className="text-2xl font-sans text-primary mb-6">
                    Cancelar Reserva
                  </h3>
                  <DeleteAppointment />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 