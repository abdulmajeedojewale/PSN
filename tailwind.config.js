/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        psn: {
          navy: {
            900: "#070F1E",
            800: "#0B192C",
            700: "#10233D",
            600: "#1A365D",
          },
          blue: {
            DEFAULT: "#1E56A0",
            light: "#3174CB",
            dark: "#143C70",
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            500: "#1E56A0",
            600: "#194A8A",
            700: "#143C70",
          },
          yellow: {
            DEFAULT: "#FDB813",
            hover: "#E5A40A",
            light: "#FEF3C7",
            50: "#FFFBEB",
            500: "#FDB813",
            600: "#D97706",
          },
          green: {
            DEFAULT: "#10B981",
            dark: "#059669",
            light: "#D1FAE5",
          },
        },
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 25, 44, 0.08), 0 2px 6px -1px rgba(11, 25, 44, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(30, 86, 160, 0.16), 0 4px 12px -2px rgba(11, 25, 44, 0.06)',
        'floating': '0 20px 40px -10px rgba(11, 25, 44, 0.25)',
      },
    },
  },
  plugins: [],
};
