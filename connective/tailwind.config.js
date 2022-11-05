/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "1bp": { min: "2074px" },
      "2bp": { max: "1241px" },
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
