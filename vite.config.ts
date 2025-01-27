import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(new URL("package.json", import.meta.url));
const pkg = JSON.parse(readFileSync(path, "utf8"));

export default defineConfig({
  optimizeDeps: {
    include: ["pdfjs-dist"],
    esbuildOptions: {
      supported: {
        "top-level-await": true,
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  plugins: [sveltekit()],
  define: {
    APPLICATION_VERSION: JSON.stringify(pkg.version),
  },
});
