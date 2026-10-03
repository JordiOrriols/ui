import { useEffect, useState } from "react";
import { useAsyncAction } from "./useAsyncAction";

export function useShareAccessForm<T extends string>({
  isOpen,
  initialAccess,
  onShare,
  onChangeAccess,
  onRemove,
}: {
  isOpen: boolean;
  initialAccess: T;
  onShare: (email: string, access: T) => Promise<void>;
  onChangeAccess: (id: string, access: T) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<T>(initialAccess);
  const { run, reset, busy, error } = useAsyncAction();
  useEffect(() => {
    reset();
    setEmail("");
    setAccess(initialAccess);
  }, [isOpen, initialAccess, reset]);
  const submit = async () => {
    const result = await run(() => onShare(email.trim().toLowerCase(), access));
    if (result.ok) setEmail("");
  };
  const changeAccess = (id: string, nextAccess: T) => run(() => onChangeAccess(id, nextAccess));
  const remove = (id: string) => run(() => onRemove(id));
  return { email, setEmail, access, setAccess, busy, error, submit, changeAccess, remove };
}
