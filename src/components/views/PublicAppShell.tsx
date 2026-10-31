import { AppShell, type AppShellProps } from "./AppShell";

export interface PublicAppShellProps extends Omit<AppShellProps, "header"> {
  header: Omit<
    AppShellProps["header"],
    "accountAction" | "projectSwitcher" | "projectSwitcherLabel"
  >;
}

export function PublicAppShell({ header, ...props }: PublicAppShellProps) {
  return (
    <AppShell
      {...props}
      header={{
        ...header,
        projectSwitcher: false,
        ...(header.language ? { language: { ...header.language, className: "inline-flex" } } : {}),
      }}
    />
  );
}
