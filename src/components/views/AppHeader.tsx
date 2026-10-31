import type { ComponentProps, ReactNode } from "react";
import { AccountButton, type AccountButtonProps } from "./AccountButton";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { getProject, type ProjectId } from "../../lib/projects";
import { LanguageSelector } from "./LanguageSelector";
import { cn } from "../../lib/utils";

export function AppHeader({
  title,
  subtitle,
  icon,
  projectId,
  projectSwitcherLabel,
  projectSwitcher = true,
  actions,
  language,
  accountAction,
  navigation,
  leading,
  testId = "header",
  children,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  projectId?: ProjectId;
  projectSwitcherLabel?: string;
  projectSwitcher?: boolean;
  actions?: ReactNode;
  language?: ComponentProps<typeof LanguageSelector>;
  accountAction?: Omit<AccountButtonProps, "projectId">;
  navigation?: ReactNode;
  /** Rendered before the brand icon, e.g. a back button. */
  leading?: ReactNode;
  testId?: string;
  children?: ReactNode;
}) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-40" data-testid={testId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between min-h-16 py-3 gap-3">
          <div className="flex items-center gap-3" data-testid="header-content">
            {leading}
            {projectId && projectSwitcher ? (
              <ProjectSwitcher
                projectId={projectId}
                {...(projectSwitcherLabel ? { label: projectSwitcherLabel } : {})}
              >
                {icon}
              </ProjectSwitcher>
            ) : (
              <div
                className={cn(
                  "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center [&_svg]:size-5",
                  !projectId && "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                )}
                style={
                  projectId
                    ? {
                        color: getProject(projectId).color,
                        backgroundColor: getProject(projectId).backgroundColor,
                      }
                    : undefined
                }
                data-testid="app-brand-icon"
              >
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-lg font-semibold text-foreground" data-testid="header-title">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground" data-testid="header-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {language && <LanguageSelector {...language} />}
            {actions}
            {accountAction && <AccountButton {...accountAction} projectId={projectId} />}
          </div>
        </div>
      </div>
      {navigation && (
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{navigation}</div>
        </div>
      )}
      {children}
    </header>
  );
}
