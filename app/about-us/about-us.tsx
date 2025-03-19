'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-sans text-primary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sobre Nosotros
        </motion.h1>
        <motion.p 
          className="text-text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Somos un equipo dedicado a brindar soluciones innovadoras y de calidad.
        </motion.p>
      </div>
    </div>
  );
};

export default AboutUs; 