/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'ny-silver': '#B1B2B2',
        "ny-orange": "#CB817C" ,
        
        "hover-on-button":"",
        
        // working 
        "bg-MASTER":"#ccfbf1",
        "bg-NAV-MASTER":"#fdba74",
        "bg-nav-bar":"white"


      },
    },
  },
  plugins: [],
}