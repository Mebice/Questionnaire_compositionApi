import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ 
      resolvers: [ElementPlusResolver()], 
  }),
  Components({
    resolvers: [
      // 1.配置 ElementPlus 採用 sass 樣式配色系統
      ElementPlusResolver({ importStyle: "sass" }),
    ],
  }),
    
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
        preprocessorOptions: {
          scss: {
            // 2.自动导入定制化样式文件进行样式覆盖
            additionalData: `
              @use "@/assets/element.scss" as *;
              @use "@/assets/var.scss" as *;
            `,
          }
        }
    }
    
})
