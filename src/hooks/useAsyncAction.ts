import { useCallback, useEffect, useRef, useState } from "react";

export function useAsyncAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const revision = useRef(0);

  useEffect(
    () => () => {
      revision.current++;
    },
    []
  );

  const reset = useCallback(() => {
    revision.current++;
    setBusy(false);
    setError(null);
  }, []);

  const run = useCallback(
    async <T>(operation: () => Promise<T>): Promise<{ ok: true; value: T } | { ok: false }> => {
      const current = ++revision.current;
      setBusy(true);
      setError(null);
      try {
        const value = await operation();
        if (revision.current !== current) return { ok: false };
        return { ok: true, value };
      } catch (err) {
        if (revision.current === current) {
          setError(err instanceof Error ? err.message : String(err));
        }
        return { ok: false };
      } finally {
        if (revision.current === current) setBusy(false);
      }
    },
    []
  );

  return { busy, error, setError, reset, run };
}
