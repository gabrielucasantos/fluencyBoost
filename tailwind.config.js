/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'duo-green': '#58CC02',
        'duo-green-hover': '#46A302',
        'duo-blue': '#84D8FF',
        'duo-dark': {
          50: '#2C3440',
          100: '#1F252E',
          200: '#181D24',
          300: '#13161C',
        },
      },
    },
  },
  plugins: [],
};