import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/radix.ts",
    "src/icons.ts",
    "src/hooks/index.ts",
    "src/tailwind-preset.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "tailwindcss"],
  treeshake: true,
  minify: false,
});
