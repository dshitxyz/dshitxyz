import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: false,
    outDir: "dist",
    target: "esnext",
    rollupOptions: {
      input: path.resolve(__dirname, "src/index.ts"),
      output: {
        format: "es",
        entryFileNames: "index.js",
      },
      external: ["fastify", "pg", "drizzle-orm"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
