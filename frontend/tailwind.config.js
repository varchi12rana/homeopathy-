/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2DD4BF', // Teal
        secondary: '#0F766E', // Dark Teal
        accent: '#CCFBF1', // Light Teal
      }
    },
  },
  plugins: [],
}
