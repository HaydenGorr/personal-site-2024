/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./nextjs-blog/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#003049',
        'secondary': '#F1F1F1',
        'secondary2': '#669BBC'
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Lora', 'serif'],
        dys: ['Lexend', 'dys'],
        Josefin : ['Josefin Sans', 'Josefin '],
      },
      boxShadow: {
        'MB': '5px 5px 0 0 #000',
        'MBs': '2px 2px 0 0 #000',
        'MB_clicked': '2px 2px 0 0 #000',
        'inner-strong': 'inset 0 4px 6px rgba(0, 0, 0, 0.2)',
        'strong-drop': '0 10px 10px rgba(0, 0, 0, 0.15)'
      },
      backgroundColor:{
        'MB_clicked': '#e2e2e2'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'img': {
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: '100%',
              display: 'block',
            },
            'h1' :{
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
              textAlign: 'center',
            },
            'p': {
              textAlign: 'justify',
            }
          },
        },
      }),
    },
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    // Define a custom plugin for the MB_clicked position movement
    function({ addUtilities }) {
      addUtilities({
        '.MB_clicked': {
          transform: 'translate(3px, 3px)', // Moves the element down and to the right by 3 pixels
        },
      });
    },
    require('@tailwindcss/typography'),
  ],
}