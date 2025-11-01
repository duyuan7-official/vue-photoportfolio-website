import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
//import tailwindcss from '@tailwindcss/vite'
//tailwindcss v4 采用vite plugins方式引入，本项目已经降级到v3版本，故注释掉
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
//    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
