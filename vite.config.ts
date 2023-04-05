import { rmSync } from 'node:fs';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';
import WindiCSS from 'vite-plugin-windicss';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path';
import multiple from 'vite-plugin-multiple';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true });

  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    plugins: [
      vue(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
            } else {
              options.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              assetsDir: 'assets',
              copyPublicDir: true,
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
            plugins: [
              viteStaticCopy({
                targets: [
                  {
                    src: 'public',
                    dest: './',
                  },
                  {
                    src: 'bar.html',
                    dest: './',
                  },
                ],
              }),
            ],
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
      WindiCSS({
        scan: {
          // By default only `src/` is scanned
          dirs: ['src/pages'],
          // We only have to specify the file extensions we actually use.
          fileExtensions: ['vue', 'js', 'ts', 'jsx', 'tsx'],
        },
      }),
      /* multiple([
        {
          name: 'bar',
          config: 'vite.config.bar.ts',
        },
      ]), */
    ],
    build: {
      modulePreload: {
        polyfill: true,
        resolveDependencies: (fileName: string, deps: string[]) => {
          return deps;
        },
      },
    },
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);

        return {
          host: url.hostname,
          port: +url.port,
        };
      })(),
    clearScreen: false,
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "./src/css/vars.sass" as *\n',
        },
      },
    },
  };
});
