import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: [
        '@agencecinq/utils',
        'vite',
        'fs-extra',
        'node:path',
        'node:url',
        'node:fs',
        'path',
        'url',
        'fs'
      ],
      output: {
        globals: {
          vite: 'Vite',
          'fs-extra': 'fsExtra',
          path: 'path'
        }
      }
    },
  },
  plugins: [
    dts(),
  ],
});
