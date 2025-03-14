/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3f51b5',
        secondary: '#f50057',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336'
      }
    },
  },
  plugins: []
}