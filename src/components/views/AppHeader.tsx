import type { ComponentProps, ReactNode } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { getProject, type ProjectId } from "../../lib/projects";
import { LanguageSelector } from "./LanguageSelector";

export function AppHeader({
  title,
  subtitle,
  icon,
  projectId,
  projectSwitcherLabel,
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
  actions?: ReactNode;
  language?: ComponentProps<typeof LanguageSelector>;
  accountAction?: {
    type: "signIn" | "signOut";
    label: string;
    onClick: () => void;
    disabled?: boolean;
    title?: string;
  };
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
            {projectId ? (
              <ProjectSwitcher
                projectId={projectId}
                {...(projectSwitcherLabel ? { label: projectSwitcherLabel } : {})}
              >
                {icon}
              </ProjectSwitcher>
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white [&_svg]:size-5">
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
            {accountAction && (
              <Button
                eventId={`header_${accountAction.type === "signIn" ? "sign_in" : "sign_out"}`}
                variant={accountAction.type === "signIn" ? "outline" : "ghost"}
                size="sm"
                aria-label={accountAction.label}
                disabled={accountAction.disabled}
                onClick={accountAction.onClick}
                title={accountAction.title}
                data-testid={accountAction.type === "signIn" ? "sign-in-button" : "sign-out-button"}
              >
                {accountAction.type === "signIn" ? (
                  <LogIn
                    className="size-4"
                    aria-hidden="true"
                    style={projectId ? { color: getProject(projectId).color } : undefined}
                  />
                ) : (
                  <LogOut className="size-4" />
                )}
                <span className="hidden md:inline">{accountAction.label}</span>
              </Button>
            )}
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
