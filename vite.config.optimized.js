import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// Optimized Vite configuration for Sunday Brunch with Giselle
// This configuration implements performance best practices

export default defineConfig({
  plugins: [
    react(),

    // Bundle size visualization (dev only)
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),

    // Compression plugin for better network performance
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),

    // PWA for offline support and better performance
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],

  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Increase chunk size warning limit temporarily
    // (should be reduced as optimizations are implemented)
    chunkSizeWarningLimit: 500,

    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },

    // Rollup optimizations
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: (id) => {
          // Core vendor chunk (always loaded)
          if (id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router')) {
            return 'vendor-react'
          }

          // 3D graphics chunk (lazy loaded)
          if (id.includes('three') ||
              id.includes('@react-three')) {
            return 'vendor-3d'
          }

          // Animation libraries chunk (lazy loaded)
          if (id.includes('gsap') ||
              id.includes('framer-motion')) {
            return 'vendor-animation'
          }

          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },

        // Asset naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },

        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },

    // Source map for debugging (disable in production)
    sourcemap: process.env.NODE_ENV !== 'production',

    // CSS code splitting
    cssCodeSplit: true,

    // Asset inlining threshold (10kb)
    assetsInlineLimit: 10240,

    // Report compressed size
    reportCompressedSize: true
  },

  // Development server optimizations
  server: {
    hmr: true,
    overlay: true
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: [
      // Exclude heavy libraries from pre-bundling if lazy loaded
      'three',
      '@react-three/fiber',
      '@react-three/drei'
    ]
  }
})

// Performance monitoring integration
// Add these environment variables to your .env file:
// VITE_SENTRY_DSN=your_sentry_dsn
// VITE_GA_ID=your_google_analytics_id