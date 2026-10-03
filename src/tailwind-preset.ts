/**
 * Tailwind CSS Preset for @jordiorriols/ui
 *
 * Use this preset in your tailwind.config to get consistent design tokens.
 *
 * @example
 * ```ts
 * import { preset } from '@jordiorriols/ui/tailwind-preset';
 *
 * export default {
 *   presets: [preset],
 *   // your config...
 * }
 * ```
 */

export const preset = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },
    },
  },
};

export default preset;
