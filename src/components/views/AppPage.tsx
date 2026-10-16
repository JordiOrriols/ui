import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

/**
 * Full-height app canvas: a light `page` background behind white cards and the
 * `AppHeader`, so every project shares the same surfaces.
 */
export function AppPage({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("min-h-screen bg-page text-foreground", className)} {...props} />;
}

/** Page body aligned with `AppHeader`'s content width and gutters. */
export function AppMain({ className, ...props }: ComponentPropsWithoutRef<"main">) {
  return (
    <main className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)} {...props} />
  );
}
