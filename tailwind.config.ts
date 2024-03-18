import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/containers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B2E83',
        secondary: '#8347A8',
        'primary-light': '#F3E3FF',
      },
      fontSize: {
        '2xs': '0.6rem',
      },
    },
  },
  plugins: [],
};
export default config;
