import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://mokaysteve.workers.dev',
  integrations: [
    react(),
    tailwind(),
    mdx(),
  ],

  output: "hybrid",

  build: {
    format: 'directory',
  },

  adapter: cloudflare()
});