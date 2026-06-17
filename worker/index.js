/**
 * Passthrough Worker — every request is handed to the ASSETS binding,
 * which serves the static Astro build. We need a main script (not the
 * newer assets-only mode) because wrangler 3.x can't cleanly migrate
 * an existing Worker that was originally deployed with a main script.
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
