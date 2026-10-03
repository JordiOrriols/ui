import type { ReactNode } from "react";

export function AppHeader({
  title,
  subtitle,
  icon,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3" data-testid="header-content">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800" data-testid="header-title">
                {title}
              </h1>
              <p className="text-xs text-slate-500" data-testid="header-subtitle">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </div>
      {children}
    </header>
  );
}
