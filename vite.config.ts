// @ts-nocheck
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/assets/styles/variables.scss";@import "@/assets/styles/mixins.scss";`
            }
        }
    },
    test: {
        environment: "jsdom",
        globals: true,
        server: {
            deps: {
                inline: ['vitest-canvas-mock']
            }
        },
        // canvas module doesn't support multi thread ?!
        poolOptions: {
            threads: {
                singleThread: true
            }
        },
        environmentOptions: {
            jsdom: {
                resources: 'usable',
            },
        },
    },
})
