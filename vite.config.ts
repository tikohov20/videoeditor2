/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
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
