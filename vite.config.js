import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure Vite/esbuild treats .js files in src/ as JSX during production build
  // so we don't have to mass-rename legacy .js React components to .jsx
  esbuild: {
    loader: 'jsx',
    // Transform both .js and .jsx in src/ so import-analysis can parse JSX
    include: /src\/.*\.(jsx|js)$/,
  },
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/build/**', '**/tutorial/**'],
    },
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    entries: ['index.html'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
