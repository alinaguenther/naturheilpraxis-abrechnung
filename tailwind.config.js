/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f9f7',   // Sehr helles Mint
          100: '#e6f3ef',  // Helles Mint
          200: '#cce7e1',  // Pastellmint
          300: '#99d1c5',  // Helles Salbei
          400: '#8bc3b6',  // Helles Graugrün
          500: '#73b6a8',  // Deine Hauptfarbe
          600: '#5a998d',  // Dein primaryDark
          700: '#4d8276',  // Dunkles Salbei
          800: '#406b61',  // Dunkles Graugrün
          900: '#264a42',  // Dein text
          950: '#1a332d',  // Sehr dunkles Graugrün
        },
        secondary: {
          50: '#f7fbfa',   // Sehr helles Pastellgrün
          100: '#e8f4f2',  // Helles Pastellgrün
          200: '#d1e9e5',  // Mittleres Pastellgrün
          300: '#b2dfdb',  // Dein accent
          400: '#93d5cf',  // Helles Türkis
          500: '#74cbc3',  // Mittleres Türkis
          600: '#5cb3ac',  // Gedämpftes Türkis
          700: '#4a918b',  // Dunkles Türkis
          800: '#3d7571',  // Sehr dunkles Türkis
          900: '#2f5956',  // Dunkelgrün
          950: '#1e3b38',  // Sehr dunkel
        },
        background: '#fbf8f4',    // Bereits definiert
        text: '#264a42',          // Bereits definiert
        accent: '#b2dfdb',        // Bereits definiert
      }
    }
  },
  plugins: [],
}

