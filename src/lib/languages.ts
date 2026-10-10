export interface LanguageOption {
  code: string;
  short: string;
  label: string;
}

/** Languages shared by every app; each label is written in its own language. */
export const APP_LANGUAGES: LanguageOption[] = [
  { code: "en", short: "EN", label: "English" },
  { code: "es", short: "ES", label: "Español" },
  { code: "ca", short: "CA", label: "Català" },
  { code: "fr", short: "FR", label: "Français" },
  { code: "de", short: "DE", label: "Deutsch" },
  { code: "it", short: "IT", label: "Italiano" },
];
