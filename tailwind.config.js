/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#0b111e",
        neon: "#00d2ff",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 210, 255, 0.15)",
      },
    },
  },
  plugins: [],
};
