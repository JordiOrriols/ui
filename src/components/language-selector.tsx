import * as React from "react";
import { cn } from "../lib/utils";

export interface Language {
  code: string;
  label: string;
}

export interface LanguageSelectorProps {
  /** Available languages to display */
  languages?: Language[];
  /** Currently selected language code */
  value?: string;
  /** Default language code if uncontrolled */
  defaultValue?: string;
  /** Callback when language changes */
  onChange?: (languageCode: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Position styling */
  position?: "absolute" | "relative" | "static";
}

const defaultLanguages: Language[] = [
  { code: "ca", label: "CA" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

const languageNames: Record<string, string> = {
  ca: "Catalan",
  es: "Spanish",
  en: "English",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
};

function LanguageSelector({
  languages = defaultLanguages,
  value,
  defaultValue = "en",
  onChange,
  className,
  position = "absolute",
}: LanguageSelectorProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedLanguage = value ?? internalValue;

  const handleLanguageChange = (langCode: string) => {
    if (value === undefined) {
      setInternalValue(langCode);
    }
    onChange?.(langCode);
  };

  const positionClasses = {
    absolute: "absolute top-5 right-5",
    relative: "relative",
    static: "",
  };

  return (
    <nav
      className={cn(
        positionClasses[position],
        "flex items-center gap-1 bg-secondary rounded-full p-1",
        className
      )}
      role="navigation"
      aria-label="Language selection"
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          aria-pressed={selectedLanguage === lang.code}
          aria-label={`Switch to ${languageNames[lang.code] ?? lang.code}`}
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium transition-all duration-200",
            selectedLanguage === lang.code
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang.label}
        </button>
      ))}
    </nav>
  );
}

export { LanguageSelector };
