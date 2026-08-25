import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gov: {
          saffron: "#FF9933",
          white: "#FFFFFF",
          green: "#138808",
          navy: "#000080",
          blue: "#003366",
          gold: "#D4AF37",
          lightBg: "#F4F7FA",
        },
        sapphire: {
          dark: "#001529",
          mid: "#002244",
          card: "#001f3f",
          border: "#003366",
          glow: "#00529B"
        }
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
