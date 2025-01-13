/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0961ed',
        'primary-light': '#2175ff',
        warning: '#fbbf24',
        'warning-light': '#fcd34d',
        error: '#ef4444',
        default: '#404040'
      }
    }
  },
  plugins: [],
} 