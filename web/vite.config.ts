import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// Builds into web/dist, which Cloudflare Pages serves at clearskinai.app
// (root directory "web", build "npm run build", output "dist"). Relative
// base, so the same build also works under a sub-path.
const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      input: {
        index: resolve(here, "index.html"),
        privacy: resolve(here, "privacy.html"),
        terms: resolve(here, "terms.html"),
      },
    },
  },
});
