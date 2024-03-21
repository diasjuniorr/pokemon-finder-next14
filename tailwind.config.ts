import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        normal: "#EAE8E1",
        bug: "#BAC226",
        dark: "#756D63",
        dragon: "#A99FE9",
        electric: "#F4BE6E",
        fairy: "#F4CFF0",
        fighting: "#B27650",
        fire: "#FF7F70",
        flying: "#AFC7FF",
        ghost: "#A5A5C9",
        grass: "#9FD360",
        ground: "#D4B881",
        ice: "#C9F3FF",
        poison: "#B58DBF",
        psychic: "#F1A9C4",
        rock: "#93836C",
        steel: "#ABB4B8",
        water: "#72BBFF",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
