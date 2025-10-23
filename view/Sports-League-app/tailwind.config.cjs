/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Include all React/Vite files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#889063",      // your main green color
        secondary: "#fuchsia",   // for hover or accents
        darkbg: "#1e293b",       // optional dark background
      },
      height: {
        '10vh': '10vh',          // custom height for navbar
      },
      spacing: {
        '20vh': '20vh',          // optional for larger padding if needed
      },
    },
  },
  plugins: [],
};
