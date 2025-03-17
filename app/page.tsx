"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070"
            alt="Restaurant ambiance"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-5xl md:text-7xl font-sans text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Bienvenido a<br />
            <span className="text-accent">Nuestro Restaurante</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Una experiencia culinaria única con los mejores sabores de la cocina internacional
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-x-4"
          >
            <Link href="/menu" className="btn btn-accent">
              Ver Menú
            </Link>
            <Link href="/booking" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
              Reservar Mesa
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="card text-center">
              <div className="text-4xl text-primary mb-4">🍽️</div>
              <h3 className="text-xl font-sans text-primary mb-2">Cocina Gourmet</h3>
              <p className="text-text-secondary">Platos preparados con los ingredientes más frescos y de la mejor calidad</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl text-primary mb-4">🌟</div>
              <h3 className="text-xl font-sans text-primary mb-2">Ambiente Elegante</h3>
              <p className="text-text-secondary">Un espacio diseñado para crear momentos inolvidables</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl text-primary mb-4">👨‍🍳</div>
              <h3 className="text-xl font-sans text-primary mb-2">Chefs Expertos</h3>
              <p className="text-text-secondary">Un equipo apasionado por crear experiencias gastronómicas únicas</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070"
            alt="Food presentation"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-sans text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Haz tu Reserva Hoy
          </motion.h2>
          <motion.p 
            className="text-lg text-white/90 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            No esperes más para disfrutar de una experiencia gastronómica inolvidable
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link href="/booking" className="btn btn-accent">
              Reservar Mesa
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
