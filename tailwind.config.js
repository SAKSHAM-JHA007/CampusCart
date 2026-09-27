/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        handwriting: ['var(--font-caveat)', 'cursive'],
      },
      colors: {
        brand: {
          navy: '#0f172a',
          orange: '#f95721',
          peach: '#ffece3',
          mint: '#dff6e9',
          sky: '#e4f1ff',
          blue: '#0284c7',
          green: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
