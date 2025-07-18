import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 后端的地址
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''), // 将请求路径中的 /api 替换为空
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
})
