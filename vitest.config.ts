import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,ts,jsx,tsx}"],
      exclude: [
        "**/node_modules/**",
        "src/main.*",
        "src/index.*",
        "src/**/*.stories.*",
        ".storybook/**",
      ],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});