/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f8fafc",
        card: "#ffffff",
        subtle: "#f1f5f9",
        brand: {
          navy: "#0f2c59",
          saffron: "#ea580c",
          green: "#15803d",
          blue: "#2563eb",
          slate: "#334155",
        },
        severity: {
          criticalShortage: "#ef4444",
          shortageWatch: "#f97316",
          balanced: "#10b981",
          oversupplyWatch: "#3b82f6",
          criticalSurplus: "#8b5cf6",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
