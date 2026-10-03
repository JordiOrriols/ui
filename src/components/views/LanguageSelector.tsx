import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "../ui/button";

export interface LanguageOption {
  code: string;
  short: string;
  label: string;
}

export function LanguageSelector({
  languages,
  value,
  onValueChange,
  label,
  className = "hidden sm:inline-flex",
}: {
  languages: LanguageOption[];
  value: string;
  onValueChange: (language: string) => void;
  label: string;
  className?: string;
}) {
  const current = value.split("-")[0];
  const short =
    languages.find((language) => language.code === current)?.short ?? languages[0]?.short;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          eventId="header_language_menu"
          variant="outline"
          size="sm"
          aria-label={label}
          data-testid="language-selector"
          className={className}
        >
          <Globe className="h-4 w-4" />
          {short}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg"
        >
          <DropdownMenu.RadioGroup value={current} onValueChange={onValueChange}>
            {languages.map((language) => (
              <DropdownMenu.RadioItem
                key={language.code}
                value={language.code}
                data-testid={`language-button-${language.code}`}
                className="flex cursor-default select-none items-center justify-between gap-4 rounded px-3 py-2 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100"
              >
                <span>{language.label}</span>
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4 text-emerald-600" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
