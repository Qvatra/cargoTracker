/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#41b883',
        'primary-light': '#42d392',
        error: '#ff4444',
        warning: '#ffbb33',
        success: '#00C851'
      }
    }
  },
  plugins: []
} 