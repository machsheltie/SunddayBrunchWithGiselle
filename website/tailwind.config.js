/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: '#FFF8DC',       // Cornsilk
                terracotta: '#E5B49A',  // Peach/Terracotta
                copper: '#C26953',      // Copper Red
                lavender: '#D8A1C4',    // Pastel Lavender
                brown: {
                    DEFAULT: '#5D4037',   // Dark Brown
                    light: '#8D7B75',     // Lighter Brown
                }
            },
            fontFamily: {
                heading: ['Cormorant Garamond', 'serif'],
                body: ['Alegreya', 'serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(93, 64, 55, 0.08)',
                'card': '0 8px 30px rgba(93, 64, 55, 0.12)',
            }
        },
    },
    plugins: [],
}
