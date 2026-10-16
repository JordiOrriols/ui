import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { PROJECTS, type ProjectId } from "../../lib/projects";
import type { WorkspaceApi, WorkspaceShare, WorkspaceShareAccess } from "../../lib/workspaces";
import type { WorkspaceLabels } from "../../lib/workspace-labels";
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

const ALL_APPS = "all";
const selectClassName =
  "h-9 w-full rounded-md border border-border bg-card px-3 text-sm disabled:opacity-50";

interface ShareRow {
  userId: string;
  email: string;
  access: Partial<Record<ProjectId, WorkspaceShareAccess>>;
}

function groupShares(shares: WorkspaceShare[]): ShareRow[] {
  const rows = new Map<string, ShareRow>();
  for (const share of shares) {
    const row = rows.get(share.user_id) ?? {
      userId: share.user_id,
      email: share.email,
      access: {},
    };
    row.access[share.app] = share.access_level;
    rows.set(share.user_id, row);
  }
  return [...rows.values()].sort((a, b) => a.email.localeCompare(b.email));
}

/** Shares one workspace per app: each person gets no access, viewer or editor in every app. */
export function WorkspaceShareDialog({
  isOpen,
  onClose,
  api,
  workspace,
  app,
  labels,
  onChanged,
}: {
  isOpen: boolean;
  onClose: () => void;
  api: WorkspaceApi;
  workspace: { id: string; name: string };
  /** The app the dialog is opened from; preselected when sharing with someone new. */
  app: ProjectId;
  labels: WorkspaceLabels;
  onChanged?: () => void | Promise<void>;
}) {
  const [rows, setRows] = useState<ShareRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState<ProjectId | typeof ALL_APPS>(app);
  const [access, setAccess] = useState<WorkspaceShareAccess>("viewer");
  const { run, reset, busy, error } = useAsyncAction();
  const text = labels.shareDialog;

  const reload = useCallback(async () => {
    setRows(groupShares(await api.listShares(workspace.id)));
  }, [api, workspace.id]);

  useEffect(() => {
    if (!isOpen) return;
    reset();
    setRows(null);
    setEmail("");
    setTarget(app);
    setAccess("viewer");
    void run(reload);
  }, [isOpen, app, reload, reset, run]);

  const changed = async () => {
    await reload();
    await onChanged?.();
  };

  const submit = () =>
    run(async () => {
      const apps = target === ALL_APPS ? PROJECTS.map((project) => project.id) : [target];
      const account = email.trim().toLowerCase();
      for (const id of apps) await api.share(workspace.id, account, id, access);
      setEmail("");
      await changed();
    });

  const setRowAccess = (row: ShareRow, id: ProjectId, next: WorkspaceShareAccess | "") =>
    run(async () => {
      const current = row.access[id];
      if (!next) await api.removeShare(workspace.id, row.userId, id);
      else if (current) await api.updateShare(workspace.id, row.userId, id, next);
      else await api.share(workspace.id, row.email, id, next);
      await changed();
    });

  const removeRow = (row: ShareRow) =>
    run(async () => {
      for (const id of Object.keys(row.access) as ProjectId[])
        await api.removeShare(workspace.id, row.userId, id);
      await changed();
    });

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-3xl" data-testid="share-workspace-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>{text.title(workspace.name)}</AlertDialogTitle>
          <AlertDialogDescription>{text.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="grid gap-3 sm:grid-cols-[1fr_150px_120px_auto]"
        >
          <div>
            <Label htmlFor="share-email">{text.email}</Label>
            <Input
              id="share-email"
              data-testid="share-email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="share-app">{text.app}</Label>
            <select
              id="share-app"
              data-testid="share-app-select"
              value={target}
              onChange={(event) => setTarget(event.target.value as ProjectId | typeof ALL_APPS)}
              className={`mt-1 ${selectClassName}`}
            >
              {PROJECTS.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
              <option value={ALL_APPS}>{text.allApps}</option>
            </select>
          </div>
          <div>
            <Label htmlFor="share-access">{text.permission}</Label>
            <select
              id="share-access"
              data-testid="share-access-select"
              value={access}
              onChange={(event) => setAccess(event.target.value as WorkspaceShareAccess)}
              className={`mt-1 ${selectClassName}`}
            >
              <option value="viewer">{labels.access.viewer}</option>
              <option value="editor">{labels.access.editor}</option>
            </select>
          </div>
          <Button
            eventId="workspace_share_add"
            data-testid="share-submit"
            type="submit"
            disabled={busy || !email.trim()}
            className="self-end"
          >
            {text.submit}
          </Button>
        </form>
        {error && (
          <p role="alert" data-testid="share-error" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="max-h-72 space-y-2 overflow-y-auto">
          {rows === null ? (
            <p className="text-sm text-muted-foreground">{text.loading}</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">{text.empty}</p>
          ) : (
            rows.map((row) => (
              <div
                key={row.userId}
                data-testid="share-row"
                className="flex flex-wrap items-center gap-2 rounded-md border border-border px-3 py-2"
              >
                <span className="min-w-40 flex-1 truncate text-sm">{row.email}</span>
                {PROJECTS.map((project) => (
                  <label key={project.id} className="flex items-center gap-1 text-xs">
                    <span className="text-muted-foreground">{project.name}</span>
                    <select
                      data-testid={`share-row-${project.id}`}
                      aria-label={text.accessFor(row.email, project.name)}
                      value={row.access[project.id] ?? ""}
                      disabled={busy}
                      onChange={(event) =>
                        void setRowAccess(
                          row,
                          project.id,
                          event.target.value as WorkspaceShareAccess | ""
                        )
                      }
                      className="h-8 rounded-md border border-border bg-card px-2 text-xs"
                    >
                      <option value="">{text.noAccess}</option>
                      <option value="viewer">{labels.access.viewer}</option>
                      <option value="editor">{labels.access.editor}</option>
                    </select>
                  </label>
                ))}
                <Button
                  eventId="workspace_share_remove"
                  data-testid="share-row-remove"
                  variant="ghost"
                  size="icon-sm"
                  disabled={busy}
                  onClick={() => void removeRow(row)}
                  aria-label={text.remove(row.email)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{text.close}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
