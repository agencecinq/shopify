// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://agencecinq.github.io',
  base: '/ui/',
  integrations: [
    starlight({
      title: 'CINQ UI',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/agencecinq/ui' },
      ],
      customCss: ['./src/styles/global.css'],
      sidebar: [
        { label: 'Getting started', items: [{ label: 'Overview', slug: '' }] },
        {
          label: 'Components',
          items: [
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Modal', slug: 'components/modal' },
            { label: 'Drawer', slug: 'components/drawer' },
            { label: 'Spinbutton', slug: 'components/spinbutton' },
            { label: 'Slider', slug: 'components/slider' },
            { label: 'Disclosure Button', slug: 'components/disclosure-button' },
            { label: 'Switch', slug: 'components/switch' },
            { label: 'Accordion', slug: 'components/accordion' },
            { label: 'Combobox', slug: 'components/combobox' },
            { label: 'Window Splitter', slug: 'components/windowsplitter' },
            { label: 'Calendar', slug: 'components/calendar' },
          ],
        },
        {
          label: 'Reference',
          items: [{ label: 'Utils', slug: 'reference/utils' }],
        },
        {
          label: 'Sandbox',
          items: [
            { label: 'Overview', slug: 'sandbox' },
            { label: 'Pixelate', slug: 'sandbox/pixelate' },
            { label: 'Dual scroll', slug: 'sandbox/dual-scroll' },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['../..'],
      },
    },
  },
});