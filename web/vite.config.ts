import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// Builds into the repo root, which GitHub Pages serves as-is
// (bornbrian.github.io/clearskin/). Relative base so it works under /clearskin/.
const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "..",
    emptyOutDir: false,
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
