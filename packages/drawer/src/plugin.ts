import { Plugin } from 'vite';
import fs from 'fs-extra';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function cinqDrawerPlugin(): Plugin {
  return {
    name: 'vite-plugin-cinq-drawer',

    async buildStart() {
      const source = resolve(__dirname, '../src/drawer.liquid'); 
      const destination = resolve(process.cwd(), 'snippets/cinq-drawer.liquid');

      try {
        if (await fs.pathExists(source)) {
          await fs.ensureDir(dirname(destination));
          await fs.copy(source, destination);
            console.log('✅ CINQ : Liquid snippet copied.');
        }
      } catch (err) {
        console.error('❌ CINQ : Copying error :', err);
      }
    },

    async handleHotUpdate({ file, server }) {
      if (file.endsWith('drawer.liquid')) {
        const destination = resolve(process.cwd(), 'snippets/cinq-drawer.html.liquid');
        await fs.copy(file, destination);
        server.ws.send({ type: 'full-reload' });
      }
    }
  };
}