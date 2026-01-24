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
        sans: ["Open Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.625rem",
        sm: "calc(0.625rem - 4px)",
        md: "calc(0.625rem - 2px)",
        lg: "0.625rem",
        xl: "calc(0.625rem + 4px)",
      },
    },
  },
};

export default preset;
