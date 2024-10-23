import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  base: "/bam/",
  plugins: [svelte()],
});
