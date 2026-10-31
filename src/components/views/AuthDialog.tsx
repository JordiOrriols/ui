import type { ComponentProps } from "react";
import { useLoginForm } from "../../hooks/useLoginForm";
import { LoginDialog } from "./LoginDialog";

export interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signIn" | "signUp";
  actions: Parameters<typeof useLoginForm>[0]["actions"];
  messages: Parameters<typeof useLoginForm>[0]["messages"];
  labels: ComponentProps<typeof LoginDialog>["labels"];
  formatError: (message: string) => string;
}

export function AuthDialog({
  isOpen,
  onClose,
  initialMode = "signIn",
  actions,
  messages,
  labels,
  formatError,
}: AuthDialogProps) {
  const form = useLoginForm({ isOpen, onClose, initialMode, actions, messages });
  return (
    <LoginDialog
      isOpen={isOpen}
      onClose={onClose}
      labels={labels}
      form={{ ...form, error: form.error === null ? null : formatError(form.error) }}
    />
  );
}
