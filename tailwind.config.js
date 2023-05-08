/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      backgroundImage: {
        'gradient-custom': 'linear-gradient(225deg, rgba(65,88,208,1) 0%, rgba(200,80,192,1) 51%, rgba(255,204,112,1) 51%, rgba(255,112,217,1) 51%, rgba(255,204,112,1) 100%)',
      },
    },
  },
  plugins: [],
};
