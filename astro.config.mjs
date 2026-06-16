import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // site: 'https://yourdomain.com', // TODO: set before deploying
  integrations: [
    react(),
    tailwind(),
    mdx(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
});
