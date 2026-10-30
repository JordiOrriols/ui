import type { ReactNode } from "react";
import { DropdownMenu } from "radix-ui";
import { Check } from "lucide-react";
import { PROJECTS, getProject, type ProjectId } from "../../lib/projects";
import { ProjectIcon } from "./ProjectIcon";
import { IconTooltip } from "../ui/icon-tooltip";

export function ProjectSwitcher({
  projectId,
  label = "Switch project",
}: {
  projectId: ProjectId;
  children?: ReactNode;
  label?: string;
}) {
  const project = getProject(projectId);
  return (
    <DropdownMenu.Root>
      <IconTooltip label={label}>
        <DropdownMenu.Trigger
          aria-label={label}
          className="relative flex size-10 shrink-0 items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>svg]:size-5"
          style={{ backgroundColor: project.backgroundColor }}
        >
          <ProjectIcon projectId={projectId} aria-hidden="true" />
        </DropdownMenu.Trigger>
      </IconTooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 min-w-56 rounded-xl border border-border bg-background p-1.5 text-foreground shadow-lg"
        >
          {PROJECTS.map(({ id, name, url }) => (
            <DropdownMenu.Item key={id} asChild>
              <a
                href={url}
                aria-current={id === projectId ? "page" : undefined}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-accent"
              >
                <ProjectIcon projectId={id} className="size-5" aria-hidden="true" />
                <span className="flex-1">{name}</span>
                {id === projectId && <Check className="size-4 text-muted-foreground" />}
              </a>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
