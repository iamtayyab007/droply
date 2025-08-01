/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class", // this is important
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f", // or any dark shade you prefer
        foreground: "#ffffff",
      },
    },
  },
  plugins: [],
};

export default config;
