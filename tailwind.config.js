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
      primary: '#73b6a8',       // mintgrün aus dem Logo
      primaryDark: '#5a998d',   // dunklere Abstufung
      background: '#fbf8f4',    // heller, warmer Hintergrund
      text: '#264a42',          // dunkles Grün für Fließtext
      accent: '#b2dfdb',        // Pastellgrün für leichte Akzente
    }
  }
},
  plugins: [],
}

