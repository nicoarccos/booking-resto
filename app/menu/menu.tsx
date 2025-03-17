'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Carpaccio de Res",
    description: "Finas láminas de res con aceite de oliva, parmesano y rúcula",
    price: 18.50,
    category: "Entradas",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800"
  },
  {
    id: 2,
    name: "Risotto de Hongos Silvestres",
    description: "Cremoso risotto con variedad de hongos y trufa negra",
    price: 24.00,
    category: "Principales",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800"
  },
  {
    id: 3,
    name: "Tiramisú Clásico",
    description: "Postre italiano tradicional con café y mascarpone",
    price: 12.00,
    category: "Postres",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800"
  },
  {
    id: 4,
    name: "Bruschetta de Tomate",
    description: "Pan tostado con tomates frescos, albahaca y ajo",
    price: 14.50,
    category: "Entradas",
    image: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?q=80&w=800"
  },
  {
    id: 5,
    name: "Salmón a la Parrilla",
    description: "Filete de salmón con hierbas frescas y limón",
    price: 28.00,
    category: "Principales",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800"
  },
  {
    id: 6,
    name: "Panna Cotta",
    description: "Postre cremoso con coulis de frutos rojos",
    price: 10.00,
    category: "Postres",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800"
  },
  {
    id: 7,
    name: "Vino Tinto Reserva",
    description: "Copa de vino tinto de la casa",
    price: 12.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800"
  },
  {
    id: 8,
    name: "Pasta al Tartufo",
    description: "Fettuccine con crema de trufa y champiñones",
    price: 26.00,
    category: "Principales",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800"
  },
  {
    id: 9,
    name: "Mojito Clásico",
    description: "Ron, menta fresca, lima y soda",
    price: 10.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800"
  }
];

const categories = ["Todos", "Entradas", "Principales", "Postres", "Bebidas"];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const filteredItems = menuItems.filter(item => 
    selectedCategory === "Todos" || item.category === selectedCategory
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-sans text-primary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nuestro Menú
        </motion.h1>
        <motion.p 
          className="text-text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Descubre nuestra selección de platos preparados con los mejores ingredientes
        </motion.p>
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-white/80 backdrop-blur-sm hover:bg-primary/10'
            }`}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Grid de elementos del menú */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="card hover-lift group"
            variants={itemVariants}
            onHoverStart={() => setHoveredItem(item.id)}
            onHoverEnd={() => setHoveredItem(null)}
          >
            {/* Imagen del plato */}
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Información del plato */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-sans text-primary">{item.name}</h3>
                <span className="text-accent font-semibold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <p className="text-text-secondary text-sm mb-4">{item.description}</p>
              <motion.button
                className="btn btn-outline w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ordenar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 