import { useEffect, useState } from "react";
import { useAsyncAction } from "./useAsyncAction";

export function usePasswordResetForm({
  isOpen,
  updatePassword,
  messages,
}: {
  isOpen: boolean;
  updatePassword: (password: string) => Promise<void>;
  messages: { passwordTooShort: string; passwordsDoNotMatch: string };
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { run, reset, busy, error, setError } = useAsyncAction();

  useEffect(() => {
    reset();
    setPassword("");
    setConfirmation("");
  }, [isOpen, reset]);

  const submit = async () => {
    if (password.length < 8) {
      setError(messages.passwordTooShort);
      return;
    }
    if (password !== confirmation) {
      setError(messages.passwordsDoNotMatch);
      return;
    }
    const result = await run(() => updatePassword(password));
    if (result.ok) {
      setPassword("");
      setConfirmation("");
    }
  };
  return { password, confirmation, setPassword, setConfirmation, busy, error, submit };
}
