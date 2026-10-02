/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e5ff",
          500: "#4f6ef7",
          600: "#3b56e0",
          700: "#2f45b8",
        },
      },
    },
  },
  plugins: [],
};
