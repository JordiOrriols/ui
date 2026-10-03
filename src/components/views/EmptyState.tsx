import type { ReactNode, ComponentProps } from "react";
import { cn } from "../../lib/utils";

export interface EmptyStateProps extends ComponentProps<"div"> {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn("bg-white rounded-2xl border border-slate-200 p-12 text-center", className)}
      {...props}
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6">{description}</p>
      {action}
    </div>
  );
}
