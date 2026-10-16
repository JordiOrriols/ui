import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

/**
 * Page tabs rendered in `AppHeader`'s `navigation` slot: tabs on the left,
 * optional actions (workspace pickers, share buttons…) on the right.
 */
export function AppNavigation({
  label,
  actions,
  children,
  className,
}: {
  label: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2", className)}
    >
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto">{children}</div>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2 py-2">{actions}</div>}
    </nav>
  );
}

export type AppNavigationItemProps = React.ComponentPropsWithoutRef<"button"> & {
  /** Render the child element (a router link, a Radix tab trigger…) with tab styling. */
  asChild?: boolean;
  /** Force the active look. Also active with `aria-current="page"` or `data-state="active"`. */
  active?: boolean;
};

// Active styling follows router links (aria-current) and Radix tabs (data-state).
const appNavigationItemClassName =
  "inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3.5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 aria-[current=page]:border-primary aria-[current=page]:text-primary aria-[current=page]:hover:bg-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:hover:bg-transparent data-[active=true]:border-primary data-[active=true]:text-primary data-[active=true]:hover:bg-transparent";

export const AppNavigationItem = React.forwardRef<HTMLButtonElement, AppNavigationItemProps>(
  function AppNavigationItem({ asChild = false, active, className, type, ...props }, ref) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type: type ?? "button" })}
        data-active={active ? "true" : undefined}
        className={cn(appNavigationItemClassName, className)}
        {...props}
      />
    );
  }
);
