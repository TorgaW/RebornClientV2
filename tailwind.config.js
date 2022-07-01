module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-purple': {
          100: '#1C004D',
          200: '#170040',
          300: '#130033',
          400: '#0E0026',
          500: '#09001A',}
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
};