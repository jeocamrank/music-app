import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3000
  },
  build: {
    outDir: "dist-react",
    // Copy public assets vào build
    copyPublicDir: true,
    rollupOptions: {
      output: {
        // Đảm bảo assets được copy đúng
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Đảm bảo Firebase sử dụng browser libraries thay vì Node.js
    conditions: ['import', 'module', 'browser', 'default'],
    mainFields: ['browser', 'module', 'main'],
  },
  // Đảm bảo Firebase được bundle đúng cách cho Electron renderer
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth'],
  },
})
