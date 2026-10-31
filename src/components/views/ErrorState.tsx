import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export type ErrorStateProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "title"> & {
  title?: string;
  message: string;
} & (
    | { onRetry: () => void; retryLabel: string; retryDisabled?: boolean }
    | { onRetry?: never; retryLabel?: never; retryDisabled?: never }
  );

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel,
  retryDisabled,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      {...props}
      role="alert"
      data-slot="error-state"
      className={cn(
        "space-y-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4",
        className
      )}
    >
      {title && <h3 className="text-sm font-medium text-destructive">{title}</h3>}
      <p className="whitespace-pre-wrap break-words text-sm text-destructive">{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry} disabled={retryDisabled}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
