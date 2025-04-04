import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], 
  esbuild: {
    loader: 'jsx', // Enable JSX in .js files
    include: /src\/.*\.js/, // This will apply to all .js files in the src directory
  },
});
