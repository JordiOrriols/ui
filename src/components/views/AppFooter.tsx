import { Github } from "lucide-react";
import { getProject, type ProjectId } from "../../lib/projects";
import { Button } from "../ui/button";

const CONTRIBUTE_LABELS: Record<string, string> = {
  en: "Contribute on GitHub",
  ca: "Contribueix a GitHub",
  es: "Contribuir en GitHub",
  fr: "Contribuer sur GitHub",
  de: "Auf GitHub beitragen",
  it: "Contribuisci su GitHub",
};

export function AppFooter({
  text = "Made with love by Jordi Orriols",
  projectId,
  contributeLabel,
  language = "en",
}: {
  text?: string;
  projectId?: ProjectId;
  contributeLabel?: string;
  language?: string;
}) {
  const label =
    contributeLabel ?? CONTRIBUTE_LABELS[language.split("-")[0] ?? "en"] ?? CONTRIBUTE_LABELS.en;
  return (
    <footer
      className="border-t border-border bg-background px-4 py-4 text-center text-xs text-muted-foreground"
      data-testid="app-footer"
    >
      <div className="relative mx-auto flex min-h-9 max-w-7xl items-center justify-center">
        <span className={projectId ? "px-10" : undefined}>{text}</span>
        {projectId && (
          <Button
            asChild
            size="icon"
            variant="ghost"
            aria-label={label}
            className="absolute right-0"
          >
            <a href={getProject(projectId).repositoryUrl} target="_blank" rel="noopener noreferrer">
              <Github className="size-4" aria-hidden="true" />
            </a>
          </Button>
        )}
      </div>
    </footer>
  );
}
