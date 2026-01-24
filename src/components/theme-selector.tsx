import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "../lib/utils";

export type Theme = "light" | "dark" | "system";

export interface ThemeSelectorProps {
  /** Current theme value */
  value?: Theme;
  /** Default theme if uncontrolled */
  defaultValue?: Theme;
  /** Callback when theme changes */
  onChange?: (theme: Theme) => void;
  /** Show system option */
  showSystem?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Variant style */
  variant?: "pill" | "buttons" | "dropdown";
}

/**
 * Applies the theme to the document
 */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.toggle("dark", systemTheme === "dark");
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

/**
 * Hook to manage theme state with localStorage persistence
 */
export function useTheme(defaultTheme: Theme = "system") {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem("theme") as Theme) || defaultTheme;
  });

  React.useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  React.useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return [theme, setTheme] as const;
}

const themeOptions = [
  { value: "light" as Theme, icon: Sun, label: "Light" },
  { value: "dark" as Theme, icon: Moon, label: "Dark" },
  { value: "system" as Theme, icon: Monitor, label: "System" },
];

function ThemeSelector({
  value,
  defaultValue = "system",
  onChange,
  showSystem = true,
  className,
  variant = "pill",
}: ThemeSelectorProps) {
  const [internalValue, setInternalValue] = React.useState<Theme>(defaultValue);
  const currentTheme = value ?? internalValue;

  const handleThemeChange = (newTheme: Theme) => {
    if (value === undefined) {
      setInternalValue(newTheme);
    }
    onChange?.(newTheme);
    applyTheme(newTheme);
  };

  const options = showSystem
    ? themeOptions
    : themeOptions.filter((opt) => opt.value !== "system");

  if (variant === "pill") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 bg-secondary rounded-full p-1",
          className
        )}
        role="radiogroup"
        aria-label="Theme selection"
      >
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              role="radio"
              aria-checked={currentTheme === option.value}
              aria-label={`Switch to ${option.label} theme`}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                currentTheme === option.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>
    );
  }

  // Buttons variant
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            role="radio"
            aria-checked={currentTheme === option.value}
            aria-label={`Switch to ${option.label} theme`}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              currentTheme === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export { ThemeSelector };
