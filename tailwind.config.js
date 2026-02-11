/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
          dark: '#0f3460',
        },
        accent: {
          DEFAULT: '#e94560',
          light: '#ff6b8a',
        },
      },
    },
  },
  plugins: [],
}
