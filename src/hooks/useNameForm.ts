import { useEffect, useState } from "react";
import { useAsyncAction } from "./useAsyncAction";

export function useNameForm({
  isOpen,
  initialName,
  onSubmit,
  onClose,
}: {
  isOpen: boolean;
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(initialName ?? "");
  const { busy, error, run, reset } = useAsyncAction();
  useEffect(() => {
    reset();
    setName(initialName ?? "");
  }, [isOpen, initialName, reset]);
  const submit = async () => {
    const result = await run(() => onSubmit(name.trim()));
    if (result.ok) onClose();
  };
  return {
    name,
    setName,
    busy,
    error,
    submit,
    disabled: busy || !name.trim() || name.trim() === initialName,
  };
}
