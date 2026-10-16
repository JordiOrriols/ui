import type { ReactNode } from "react";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { PROJECTS, type ProjectId } from "../../lib/projects";

export function ProjectSwitcher({
  projectId,
  children,
  label = "Switch project",
}: {
  projectId: ProjectId;
  children: ReactNode;
  label?: string;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={label}
        className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-700 text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&>svg]:size-5"
      >
        {children}
        <ChevronDown className="absolute bottom-0.5 right-0.5 !size-2.5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 min-w-56 rounded-xl border border-border bg-background p-1.5 text-foreground shadow-lg"
        >
          {PROJECTS.map(({ id, name, url, icon: Icon }) => (
            <DropdownMenu.Item key={id} asChild>
              <a
                href={url}
                aria-current={id === projectId ? "page" : undefined}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-accent"
              >
                <Icon className="size-5 text-sky-600" />
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
