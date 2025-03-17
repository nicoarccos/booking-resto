import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales
        primary: {
          DEFAULT: '#722F37', // Borgoña
          light: '#8B3B44',
          dark: '#5C2529',
        },
        secondary: {
          DEFAULT: '#4A5D4C', // Verde Oliva
          light: '#5B725E',
          dark: '#3A483C',
        },
        accent: {
          DEFAULT: '#C8A97E', // Dorado
          light: '#D4BA96',
          dark: '#B69468',
        },
        // Fondos
        background: {
          DEFAULT: '#F5F2EA', // Crema
          alt: '#EBE6D6',    // Beige
        },
        // Texto
        text: {
          primary: '#545454',   // Gris Cálido
          secondary: '#767676', // Gris Medio
        },
        // Estados
        success: '#4A5D4C',     // Verde Oliva
        error: '#722F37',       // Borgoña
        warning: '#E07A5F',     // Terracota
        info: '#C8A97E',        // Dorado
      },
      fontFamily: {
        sans: ['Playfair Display', 'system-ui', 'sans-serif'],
        body: ['Lato', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        'default': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'highlight': '0 0 0 2px rgba(200, 169, 126, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale': 'scale 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
