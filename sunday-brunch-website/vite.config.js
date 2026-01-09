import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    // React ecosystem (changes infrequently, good for caching)
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    // Animation libraries (kept together for the magic)
                    'animation-vendor': ['framer-motion', 'gsap'],
                    // Three.js ecosystem (only for watercolor canvas)
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
                }
            }
        },
        terserOptions: {
            compress: {
                // Remove console statements in production
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info']
            }
        }
    },
    // Ensure PropTypes are removed in production
    define: {
        'process.env.NODE_ENV': JSON.stringify('production')
    }
})
