import * as React from "react";
import { cn } from "../lib/utils";

export interface HeaderProps {
  /** Logo or icon element */
  logo?: React.ReactNode;
  /** Main title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Left side content (after logo/title) */
  leftContent?: React.ReactNode;
  /** Right side content (actions, buttons, etc.) */
  rightContent?: React.ReactNode;
  /** Whether the header should be sticky */
  sticky?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show border bottom */
  bordered?: boolean;
  /** Background variant */
  variant?: "solid" | "transparent" | "blur";
}

function Header({
  logo,
  title,
  subtitle,
  leftContent,
  rightContent,
  sticky = true,
  className,
  bordered = true,
  variant = "solid",
}: HeaderProps) {
  const variantClasses = {
    solid: "bg-background",
    transparent: "bg-transparent",
    blur: "bg-background/80 backdrop-blur-xl",
  };

  return (
    <header
      className={cn(
        "z-40 w-full",
        sticky && "sticky top-0",
        bordered && "border-b border-border",
        variantClasses[variant],
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo + Title */}
          <div className="flex items-center gap-3">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            {(title || subtitle) && (
              <div>
                {title && (
                  <h1 className="text-lg font-semibold text-foreground">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
            {leftContent}
          </div>

          {/* Right side: Actions */}
          {rightContent && (
            <div className="flex items-center gap-2">{rightContent}</div>
          )}
        </div>
      </div>
    </header>
  );
}

export interface HeaderLogoProps {
  /** Icon component or element */
  icon?: React.ReactNode;
  /** Gradient colors for background */
  gradient?: string;
  /** Additional CSS classes */
  className?: string;
}

function HeaderLogo({
  icon,
  gradient = "from-primary to-primary/80",
  className,
}: HeaderLogoProps) {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
        gradient,
        className
      )}
    >
      {icon}
    </div>
  );
}

export { Header, HeaderLogo };
