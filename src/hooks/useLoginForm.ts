import { useEffect, useState } from "react";
import type { AuthActions } from "./useSupabaseAuth";
import { useAsyncAction } from "./useAsyncAction";

export type AuthMode = "signIn" | "signUp" | "forgotPassword";

export function useLoginForm({
  isOpen,
  initialMode = "signIn",
  actions,
  onClose,
  messages,
}: {
  isOpen: boolean;
  initialMode?: AuthMode;
  actions: Pick<AuthActions, "signIn" | "signUp" | "signInWithGitHub" | "requestPasswordReset">;
  onClose: () => void;
  messages: { passwordResetSent: string; checkEmail: string };
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const { run, reset, busy, error } = useAsyncAction();

  useEffect(() => {
    reset();
    setMode(initialMode);
    setPassword("");
    setInfo(null);
  }, [isOpen, initialMode, reset]);

  const changeMode = (next: AuthMode) => {
    reset();
    setMode(next);
    setPassword("");
    setInfo(null);
  };

  const submit = async () => {
    setInfo(null);
    if (mode === "forgotPassword") {
      const result = await run(() => actions.requestPasswordReset(email));
      if (result.ok) setInfo(messages.passwordResetSent);
    } else if (mode === "signIn") {
      const result = await run(() => actions.signIn(email, password));
      if (result.ok) onClose();
    } else {
      const result = await run(() => actions.signUp(email, password));
      if (result.ok) {
        if (result.value.needsConfirmation) setInfo(messages.checkEmail);
        else onClose();
      }
    }
  };

  const signInWithGitHub = async () => {
    setInfo(null);
    await run(() => actions.signInWithGitHub());
  };

  return {
    mode,
    email,
    password,
    info,
    busy,
    error,
    setEmail,
    setPassword,
    changeMode,
    submit,
    signInWithGitHub,
  };
}
