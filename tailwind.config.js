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
        'primary': '#FF0000',
        'secondary': '#FF6B6B',
        'dark': '#0F0F0F',
        'dark-100': '#272727',
        'dark-200': '#1F1F1F'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}

