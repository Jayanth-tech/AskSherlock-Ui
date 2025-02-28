import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'minimal-bounce': 'minimal-bounce 2s ease-in-out infinite',
        scroll: 'scrollText 10s linear infinite',
      },
      keyframes: {
        'minimal-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }, 
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

