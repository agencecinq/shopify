import { Plugin } from 'vite';
import fs from 'fs-extra';
import { resolve } from 'node:path';

export function cinqDrawerPlugin(): Plugin {
  return {
    name: 'vite-plugin-cinq-drawer',

    // 1. Copie des fichiers au démarrage et lors du build
    async buildStart() {
      const source = resolve(__dirname, '../src/drawer.liquid');
      // On cible le dossier snippets de l'app Shopify
      // Note: Ajustez le chemin relatif selon votre structure réelle
      const destination = resolve(process.cwd(), 'snippets/cinq-drawer.liquid');

      try {
        if (await fs.pathExists(source)) {
          await fs.copy(source, destination);
          console.log('✅ Snippet Liquid copié avec succès.');
        }
      } catch (err) {
        console.error('❌ Erreur lors de la copie du snippet:', err);
      }
    },

    // 2. Surveillance des changements (HMR)
    handleHotUpdate({ file, server }) {
      if (file.endsWith('drawer.liquid')) {
        console.log('♻️  Modification Liquid détectée, actualisation...');
        
        // On relance la copie pour que le thème Shopify reçoive la version à jour
        const destination = resolve(process.cwd(), 'snippets/cinq-drawer.liquid');
        fs.copySync(file, destination);

        // On force Vite à signaler le changement
        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
      }
    }
  };
}