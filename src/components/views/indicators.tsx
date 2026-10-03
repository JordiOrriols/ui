import type { ComponentProps, ReactNode } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import * as Progress from "@radix-ui/react-progress";
import { User } from "lucide-react";
import { cn } from "../../lib/utils";

export function Spinner({ label, className, ...props }: ComponentProps<"div"> & { label: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "h-10 w-10 animate-spin motion-reduce:animate-none rounded-full border-2 border-slate-200 border-b-slate-600",
        className
      )}
      {...props}
    />
  );
}

export function UserAvatar({
  src,
  label,
  fallback,
  className,
  ...props
}: ComponentProps<typeof Avatar.Root> & {
  src?: string;
  label: string;
  fallback?: ReactNode;
}) {
  return (
    <Avatar.Root
      className={cn(
        "w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0 overflow-hidden",
        className
      )}
      {...props}
    >
      {src && <Avatar.Image src={src} alt={label} className="h-full w-full object-cover" />}
      <Avatar.Fallback aria-label={label}>
        {fallback ?? <User className="w-5 h-5 text-slate-500" />}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}

export function ProgressIndicator({
  value,
  label,
  className,
}: {
  value: number | null;
  label: string;
  className?: string;
}) {
  const bounded = value === null ? null : Math.min(100, Math.max(0, value));
  return (
    <Progress.Root
      value={bounded}
      max={100}
      aria-label={label}
      className={cn("h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100", className)}
    >
      <Progress.Indicator
        className="h-full rounded-full bg-indigo-500"
        style={{ width: bounded === null ? "100%" : `${bounded}%` }}
      />
    </Progress.Root>
  );
}

export function StatusBadge({
  children,
  positive = false,
  className,
  ...props
}: ComponentProps<"span"> & { positive?: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded",
        positive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
