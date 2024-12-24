/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      screens: {
        'xxs': '290px',       // Custom extra small breakpoint
        'xs': '445px', 
        '3xl': '1920px',     // Custom extra large breakpoint
      },
    },
  },
  plugins: [],
}