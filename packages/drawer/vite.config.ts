import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        plugin: resolve(import.meta.dirname, 'src/plugin.ts')
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: [
        '@agencecinq/utils',
        'vite',
        'node:path',
        'node:url',
        'node:fs/promises',
      ],
    },
  },
  plugins: [
    dts(),
  ],
});
