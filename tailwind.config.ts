import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#22C55E',
        'primary-DEFAULT': '#22C55E',
        'primary-dark': '#04df79',
        'secondary-light':'#ef4444',
        'secondary_DEFAULT':'#ef4444',
        'secondary-dark':'#dc2626'
      },
    },
  },
  plugins: [],
};
export default config;
