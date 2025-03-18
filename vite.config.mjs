import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import vueDevTools from 'vite-plugin-vue-devtools'
import {PrimeVueResolver} from '@primevue/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        Components({
            resolvers: [
                PrimeVueResolver()
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    }
});
