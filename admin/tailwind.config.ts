import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#B89B3A', // Gold
          light: '#F6E7B1',   // Light gold
          dark: '#7C6A3A'     // Dark gold
        },
        accent: {
          DEFAULT: '#3C2A1E', // Deep brown
          light: '#F9F6F2',   // Off white
        },
        white: '#fff',
        black: '#000',
      },
      borderRadius: {
        xl: '1rem',
        lg: '0.75rem',
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(184,155,58,0.08)',
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif'],
      }
    }
  },
  plugins: []
};

export default config;
