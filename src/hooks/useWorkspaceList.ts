import { useCallback, useEffect, useState } from "react";
import type { ProjectId } from "../lib/projects";
import type { WorkspaceApi, WorkspaceSummary } from "../lib/workspaces";

function storageKey(app: ProjectId) {
  return `${app}.workspace`;
}

function readSelection(app: ProjectId) {
  try {
    return localStorage.getItem(storageKey(app)) ?? "";
  } catch {
    return "";
  }
}

/**
 * Loads the workspaces the signed-in account can open in `app` and remembers the selected one.
 * Pass a stable `api`; the list reloads when it changes.
 */
export function useWorkspaceList(api: WorkspaceApi | null, app: ProjectId) {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[] | null>(null);
  const [selected, setSelected] = useState(() => readSelection(app));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!api) return;
    try {
      setWorkspaces(await api.listWorkspaces(app));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [api, app]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const select = useCallback(
    (id: string) => {
      setSelected(id);
      try {
        localStorage.setItem(storageKey(app), id);
      } catch {
        // Private browsing can refuse storage; the selection still holds for this visit.
      }
    },
    [app]
  );

  const workspace = workspaces?.find((item) => item.id === selected) ?? workspaces?.[0] ?? null;
  return { workspaces, workspace, select, refresh, error, loading: workspaces === null && !error };
}
