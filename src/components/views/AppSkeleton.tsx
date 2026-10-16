import { cn } from "../../lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse motion-reduce:animate-none rounded-md bg-muted", className)}
    />
  );
}

export function AppSkeleton({
  label = "Loading application",
  fullPage = true,
}: {
  label?: string;
  fullPage?: boolean;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cn("bg-background", fullPage && "min-h-screen")}
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        {fullPage && (
          <div className="border-b border-border">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-5">
              <Skeleton className="size-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="ml-auto h-8 w-20" />
            </div>
            <div className="mx-auto flex max-w-7xl gap-3 px-6 pb-3">
              {[0, 1, 2].map((key) => (
                <Skeleton key={key} className="h-7 w-24" />
              ))}
            </div>
          </div>
        )}
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
          <div className="space-y-3">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-3 w-3/4 max-w-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <div key={key} className="space-y-4 rounded-xl border border-border p-5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-32" />
              </div>
            ))}
          </div>
          <div className="space-y-5 rounded-xl border border-border p-5">
            <Skeleton className="h-4 w-36" />
            {[0, 1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
