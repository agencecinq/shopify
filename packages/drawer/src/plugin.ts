import { Plugin } from 'vite';
import { access, cp, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function cinqDrawerPlugin(): Plugin {
  return {
    name: 'vite-plugin-cinq-drawer',

    async buildStart() {
      const source = resolve(__dirname, '../src/drawer.html.liquid');
      const destination = resolve(process.cwd(), 'snippets/cinq-drawer.html.liquid');

      try {
        if (await pathExists(source)) {
          await mkdir(dirname(destination), { recursive: true });
          await cp(source, destination);
          console.log('✅ CINQ : Liquid snippet copied.');
        }
      } catch (err) {
        console.error('❌ CINQ : Copying error :', err);
      }
    },

    async handleHotUpdate({ file, server }) {
      if (file.endsWith('drawer.html.liquid')) {
        const destination = resolve(process.cwd(), 'snippets/cinq-drawer.html.liquid');
        await cp(file, destination);
        server.ws.send({ type: 'full-reload' });
      }
    }
  };
}
