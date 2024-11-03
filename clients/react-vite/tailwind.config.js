/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E6F0FF',
          200: '#BAD5FE',
          300: '#8DBAFD',
          400: '#619EFC',
          500: '#3483FB',
          600: '#0A66E4',
          700: '#084DB0',
          800: '#06377D',
          900: '#042049',
        },
        secondary: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      width: {
        'chat': 'calc(100% - 260px)',
      },
      maxWidth: {
        'chat': '48rem',
      },
      minHeight: {
        'chat': 'calc(100vh - 150px)',
      },
      transitionProperty: {
        'width': 'width',
      },
    },
  },
  plugins: [],
} 