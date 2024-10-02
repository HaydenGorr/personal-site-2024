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
        'secondary2': '#669BBC',

        'dg-50': '#EBFFF5',
        'dg-100': '#D0FBE6',
        'dg-200': '#A4F6D2',
        'dg-300': '#6AEBBB',
        'dg-400': '#2FD89E',
        'dg-500': '#0ABF87',
        'dg-600': '#00A676',
        'dg-700': '#007C5C',
        'dg-800': '#036249',
        'dg-900': '#04503E',
        'dg-950': '#012D24',

        'dy-50': '#FDFBED',
        'dy-100': '#F7F2CE',
        'dy-200': '#EFE498',
        'dy-300': '#E7D062',
        'dy-400': '#E2C044',
        'dy-500': '#D9A227',
        'dy-600': '#C07F1F',
        'dy-700': '#9F5E1E',
        'dy-800': '#824A1E',
        'dy-900': '#6B3D1C',
        'dy-950': '#3D1F0B',

        'dpu-50': '#F9F8FB',
        'dpu-100': '#F3F1F6',
        'dpu-200': '#E4E1ED',
        'dpu-300': '#D1CADD',
        'dpu-400': '#B5A9C9',
        'dpu-500': '#9786AF',
        'dpu-600': '#73628A',
        'dpu-700': '#645477',
        'dpu-800': '#534662',
        'dpu-900': '#463C53',
        'dpu-950': '#292032',

        'dpi-50': '#FFF0F1',
        'dpi-100': '#FFE2E5',
        'dpi-200': '#FFC9D2',
        'dpi-300': '#FF9CAC',
        'dpi-400': '#FF7581',
        'dpi-500': '#F65581',
        'dpi-600': '#EC0B43',
        'dpi-700': '#CE023A',
        'dpi-800': '#AC0538',
        'dpi-900': '#930837',
        'dpi-950': '#520018',

        'dr-50': '#FEF3F2',
        'dr-100': '#FEE5E2',
        'dr-200': '#FED0CA',
        'dr-300': '#FCBFB7',
        'dr-400': '#F78172',
        'dr-500': '#F15945',
        'dr-600': '#DA3D28',
        'dr-700': '#B82F1D',
        'dr-800': '#982A1C',
        'dr-900': '#7E291E',
        'dr-950': '#45110A',
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
      height:{
        '128': '30rem',
      },
      backgroundImage:{
        'dg-radial-gradient': 'radial-gradient(rgb(3, 80, 62), rgb(0, 0, 0, 0))',
        'dy-radial-gradient': 'radial-gradient(rgb(130, 74, 29), rgb(0, 0, 0, 0))',
        'dr-radial-gradient': 'radial-gradient(rgb(152, 42, 28), rgb(0, 0, 0, 0))',
        'dpu-radial-gradient': 'radial-gradient(rgb(83, 69, 98), rgb(0, 0, 0, 0))',
        'dpi-radial-gradient': 'radial-gradient(rgb(206, 105, 136), rgb(0, 0, 0, 0))',
      },
      screens: {
        'mdl': '1200px',
        'mds': '900px',
      },
      margin:{
        '-2': '-2rem',
        '-4': '-4rem',
        '-8': '-8rem',
        '-16': '-16rem',
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