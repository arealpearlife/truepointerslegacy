import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.tsx"],
  },
  resolve: {
    alias: [
      {
        find: "@truepointers/commerce/testing",
        replacement: path.resolve(__dirname, "../../packages/commerce/src/testing.ts"),
      },
      {
        find: "@truepointers/commerce",
        replacement: path.resolve(__dirname, "../../packages/commerce/src/index.ts"),
      },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
});
