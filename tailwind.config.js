/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B4513', // Marrón cálido
          dark: '#6B3410',
          light: '#A65D1E',
          rgb: '139, 69, 19'
        },
        secondary: {
          DEFAULT: '#556B2F', // Verde oliva
          dark: '#3E4D22',
          light: '#6B833C',
          rgb: '85, 107, 47'
        },
        accent: {
          DEFAULT: '#DAA520', // Dorado
          dark: '#B58A1B',
          light: '#E3B94D',
          rgb: '218, 165, 32'
        },
        background: {
          DEFAULT: '#FFFFFF',
          alt: '#F8F8F8'
        },
        text: {
          primary: '#2D3748',
          secondary: '#4A5568'
        },
        error: {
          DEFAULT: '#E53E3E',
          dark: '#C53030'
        }
      },
      fontFamily: {
        sans: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif']
      },
      borderRadius: {
        default: '0.5rem'
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scale': 'scale 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scale: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: [],
} 