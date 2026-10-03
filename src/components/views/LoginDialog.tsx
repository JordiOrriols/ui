import { Github } from "lucide-react";
import type { useLoginForm } from "../../hooks/useLoginForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export interface LoginLabels {
  signInTitle: string;
  signUpTitle: string;
  forgotPasswordTitle: string;
  description: string;
  forgotPasswordDescription: string;
  continueWithGitHub: string;
  email: string;
  password: string;
  forgotPassword: string;
  switchToSignUp: string;
  switchToSignIn: string;
  backToSignIn: string;
  cancel: string;
  signIn: string;
  signUp: string;
  sendResetEmail: string;
}

export function LoginDialog({
  isOpen,
  onClose,
  form,
  labels,
}: {
  isOpen: boolean;
  onClose: () => void;
  form: ReturnType<typeof useLoginForm>;
  labels: LoginLabels;
}) {
  const { mode, email, password, error, info, busy } = form;
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
          className="space-y-4"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              {mode === "signIn"
                ? labels.signInTitle
                : mode === "signUp"
                  ? labels.signUpTitle
                  : labels.forgotPasswordTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {mode === "forgotPassword" ? labels.forgotPasswordDescription : labels.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {mode !== "forgotPassword" && (
            <Button
              eventId="auth_github"
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => void form.signInWithGitHub()}
              className="w-full"
            >
              <Github className="h-4 w-4" />
              {labels.continueWithGitHub}
            </Button>
          )}
          <div className="space-y-3">
            <div>
              <Label htmlFor="login-email">{labels.email}</Label>
              <Input
                id="login-email"
                data-testid="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => form.setEmail(event.target.value)}
                className="mt-1"
              />
            </div>
            {mode !== "forgotPassword" && (
              <div>
                <Label htmlFor="login-password">{labels.password}</Label>
                <Input
                  id="login-password"
                  data-testid="login-password"
                  type="password"
                  autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => form.setPassword(event.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            {error && (
              <p role="alert" data-testid="login-error" className="text-sm text-red-600">
                {error}
              </p>
            )}
            {info && (
              <p className="text-sm text-emerald-700" data-testid="login-info">
                {info}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {mode === "signIn" && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => form.changeMode("forgotPassword")}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {labels.forgotPassword}
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => form.changeMode(mode === "signIn" ? "signUp" : "signIn")}
                className="text-xs text-indigo-600 hover:underline"
              >
                {mode === "signIn"
                  ? labels.switchToSignUp
                  : mode === "signUp"
                    ? labels.switchToSignIn
                    : labels.backToSignIn}
              </button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">{labels.cancel}</AlertDialogCancel>
            <Button
              eventId={`auth_${mode}`}
              data-testid="login-submit"
              type="submit"
              disabled={busy}
            >
              {mode === "signIn"
                ? labels.signIn
                : mode === "signUp"
                  ? labels.signUp
                  : labels.sendResetEmail}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
