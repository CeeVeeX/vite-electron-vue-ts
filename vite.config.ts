/// <reference types="vitest" />

import fs from 'node:fs'
import path, { resolve } from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'

  // eslint-disable-next-line node/prefer-global/process
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      VueMacros({
        defineOptions: false,
        defineModels: false,
        plugins: {
          vue: Vue({
            script: {
              propsDestructure: true,
              defineModel: true,
            },
          }),
        },
      }),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          '@vueuse/core',
          'vue-router',
          {
            '@vueuse/electron': [
              'useIpcRenderer',
              'useIpcRendererInvoke',
              'useIpcRendererOn',
              'useZoomFactor',
              'useZoomLevel',
            ],
          },
        ],
        dts: true,
        dirs: [
          './src/composables',
          './src/ipc',
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/vite-plugin-components
      Components({
        resolvers: [],
        dts: true,
      }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      UnoCSS(),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart({ startup }) {
            // eslint-disable-next-line node/prefer-global/process
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            }
            else {
              startup()
            }
          },
          vite: {
            resolve: {
              alias: {
                'el/': `${path.resolve(__dirname, 'electron/main')}/`,
              },
            },
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              target: 'node20',
              rollupOptions: {
                output: {
                  manualChunks(id: string) {
                    if (id.includes('node_modules')) {
                      return 'vendor' // 打包到vendor-hash.js，vendor-hash.css
                    }

                    // if (id.includes('common/')) {
                    //   return 'common'
                    // }

                    // services 目录所有文件打包到 services-[name]-hash.js
                    if (id.includes('services/')) {
                      // return `services-${id.split('services/')[1].split('.')[0]}`
                      return 'services'
                    }
                  },
                },
                // 一些第三方的 Node.js 库，特别是 `C/C++` 插件，可能无法被 Vite 正确构建，
                // 我们可以使用 `external` 来排除它们，以确保它们能正常工作。
                // 其他库需要将它们放在 `dependencies` 中，以确保它们在应用构建后被打包到 `app.asar` 中。
                // 当然，这并不是绝对的，这种方式只是相对简单的一种方法。 :)
                external: [],
              },
            },
          },
        },
        preload: {
          // 快捷方式 build.rollupOptions.input。
          // 预加载脚本可能包含Web资产，因此请使用 build.rollupOptions.input 反而 build.lib.entry。
          input: [
            'electron/preload/ipc.ts',
            'electron/preload/index.ts',
          ],
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                output: {
                  // 选项“output.inlineDynamicImports”的值无效 - 当“output.inlineDynamicImports”为真时，不支持多个输入。
                  inlineDynamicImports: false,
                },
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {},
      }),
    ],
    clearScreen: false,
    server: {
      port: 3344,
    },
    build: {
      rollupOptions: {
        input: {
          // 配置所有页面路径，使得所有页面都会被打包
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },
  }
})
