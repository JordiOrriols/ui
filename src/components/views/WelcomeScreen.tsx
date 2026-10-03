import type { ReactNode } from "react";
import { Button } from "../ui/button";

export interface WelcomeScreenProps {
  brand: string;
  icon: ReactNode;
  title: string;
  description: string;
  features: { label: string; icon: ReactNode }[];
  signInLabel: string;
  signUpLabel: string;
  onSignIn: () => void;
  onSignUp: () => void;
  disabled?: boolean;
  notice?: ReactNode;
  children?: ReactNode;
}

export function WelcomeScreen({
  brand,
  icon,
  title,
  description,
  features,
  signInLabel,
  signUpLabel,
  onSignIn,
  onSignUp,
  disabled = false,
  notice,
  children,
}: WelcomeScreenProps) {
  return (
    <main
      className="min-h-screen grid place-items-center bg-background px-6 text-foreground"
      data-testid="welcome-page"
    >
      <div className="w-full max-w-xl space-y-8 py-16">
        <div className="flex gap-3 items-center text-primary [&_svg]:size-8">
          {icon}
          <span className="font-semibold text-xl">{brand}</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          {features.map((feature) => (
            <div key={feature.label}>
              <div className="mb-2 [&_svg]:size-6">{feature.icon}</div>
              {feature.label}
            </div>
          ))}
        </div>
        {notice}
        <div className="flex flex-wrap gap-3">
          <Button
            eventId="welcome_sign_in"
            data-testid="welcome-sign-in"
            disabled={disabled}
            onClick={onSignIn}
          >
            {signInLabel}
          </Button>
          <Button
            eventId="welcome_sign_up"
            data-testid="welcome-sign-up"
            variant="outline"
            disabled={disabled}
            onClick={onSignUp}
          >
            {signUpLabel}
          </Button>
        </div>
        {children}
      </div>
    </main>
  );
}
