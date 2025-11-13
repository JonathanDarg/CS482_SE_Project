/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Include all React/Vite files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9a3412",    //dark orange      
        secondary: "#ea580c", //light orange  
        darkbg: "#1e293b",       
      },
    },
  },
  plugins: [],
};
