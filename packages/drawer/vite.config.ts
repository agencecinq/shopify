import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        plugin: resolve(__dirname, 'src/plugin.ts')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: [
        "@agencecinq/utils",
        "vite",
        "fs-extra",
        "path",
        "node:path",
        "node:fs",
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
