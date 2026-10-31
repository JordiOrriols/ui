import type { ComponentProps, ReactNode } from "react";
import type { ProjectId } from "../../lib/projects";
import { cn } from "../../lib/utils";
import { AppPage, AppMain } from "./AppPage";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { ProjectIcon } from "./ProjectIcon";

export interface AppShellProps {
  projectId: ProjectId;
  header: Omit<ComponentProps<typeof AppHeader>, "projectId" | "icon">;
  footer?: Omit<ComponentProps<typeof AppFooter>, "projectId">;
  children: ReactNode;
  className?: string;
  mainClassName?: string;
}

export function AppShell({
  projectId,
  header,
  footer,
  children,
  className,
  mainClassName,
}: AppShellProps) {
  return (
    <AppPage className={cn("flex flex-col", className)}>
      <AppHeader {...header} projectId={projectId} icon={<ProjectIcon projectId={projectId} />} />
      <AppMain className={cn("w-full flex-1", mainClassName)}>{children}</AppMain>
      <AppFooter language={header.language?.value} {...footer} projectId={projectId} />
    </AppPage>
  );
}
