import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/test/**/*.test.ts"],
    // Pyodide tests load scikit-learn on first import (several MB, then cached).
    testTimeout: 180_000,
  },
});
