/**
 * Minimal ambient types for the library.
 *
 * The library is deliberately bundler-agnostic, so it does not depend on
 * `vite/client`. We only rely on `import.meta.env.DEV` to decide whether to
 * surface analytics events in development, so we declare just that much here.
 */
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}