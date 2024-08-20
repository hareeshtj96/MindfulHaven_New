/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        btncolor: '#79A79F',
        customGreen: '#71CDA6',
        headercolor: '#FFFFFF',
        footerBg: '#E3F5DC'
      },
    },
  },
  plugins: [],
}

