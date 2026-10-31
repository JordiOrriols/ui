import { useCallback, useEffect, useState } from "react";
import { Link2, Mail, Trash2 } from "lucide-react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { PROJECTS, type ProjectId } from "../../lib/projects";
import { cn } from "../../lib/utils";
import type { WorkspaceApi, WorkspaceShare, WorkspaceShareAccess } from "../../lib/workspaces";
import type { WorkspaceLabels } from "../../lib/workspace-labels";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SelectField } from "../ui/select-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { WorkspacePublicLink, type WorkspacePublicLinkConfig } from "./WorkspacePublicLink";
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
const ACCESS_STYLES = {
  "": "border-border bg-muted text-muted-foreground",
  viewer: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  editor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};
const ACCESS_DOTS = { "": "bg-slate-400", viewer: "bg-blue-500", editor: "bg-emerald-600" };

interface ShareRow {
  userId: string;
  email: string;
  access: Partial<Record<ProjectId, WorkspaceShareAccess>>;
}

export interface WorkspaceSharingConfig {
  publicLink: WorkspacePublicLinkConfig;
  /** Authorized current-app directory; never use the owner-only listShares RPC here. */
  readAccess: () => Promise<WorkspaceShare[]>;
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
  canManage = true,
  sharing,
}: {
  isOpen: boolean;
  onClose: () => void;
  api: WorkspaceApi;
  workspace: { id: string; name: string };
  /** The app the dialog is opened from; preselected when sharing with someone new. */
  app: ProjectId;
  labels: WorkspaceLabels;
  onChanged?: () => void | Promise<void>;
  canManage?: boolean;
  sharing?: WorkspaceSharingConfig;
}) {
  const [rows, setRows] = useState<ShareRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState<ProjectId | typeof ALL_APPS>(app);
  const [access, setAccess] = useState<WorkspaceShareAccess>("viewer");
  const [tab, setTab] = useState("emails");
  const { run, reset, busy, error } = useAsyncAction();
  const text = labels.shareDialog;
  const projects = PROJECTS.filter((project) => canManage || project.id === app);
  const columns = {
    gridTemplateColumns: `minmax(180px,1fr) repeat(${projects.length},120px)${canManage ? " 32px" : ""}`,
  };
  const accessOptions = [
    { value: "", label: text.noAccess, indicatorClassName: ACCESS_DOTS[""] },
    { value: "viewer", label: labels.access.viewer, indicatorClassName: ACCESS_DOTS.viewer },
    { value: "editor", label: labels.access.editor, indicatorClassName: ACCESS_DOTS.editor },
  ];

  const reload = useCallback(async () => {
    if (!canManage && !sharing) throw new Error("Read-only sharing requires an access directory");
    const shares =
      sharing && !canManage ? await sharing.readAccess() : await api.listShares(workspace.id);
    setRows(groupShares(canManage ? shares : shares.filter((share) => share.app === app)));
  }, [api, workspace.id, canManage, sharing, app]);

  useEffect(() => {
    if (!isOpen) return;
    reset();
    setRows(null);
    setEmail("");
    setTarget(app);
    setAccess("viewer");
    setTab("emails");
    void run(reload);
  }, [isOpen, app, reload, reset, run]);

  const changed = async () => {
    await reload();
    await onChanged?.();
  };

  const submit = () =>
    run(async () => {
      if (!canManage) return;
      const apps = target === ALL_APPS ? PROJECTS.map((project) => project.id) : [target];
      const account = email.trim().toLowerCase();
      for (const id of apps) await api.share(workspace.id, account, id, access);
      setEmail("");
      await changed();
    });

  const setRowAccess = (row: ShareRow, id: ProjectId, next: WorkspaceShareAccess | "") =>
    run(async () => {
      if (!canManage) return;
      const current = row.access[id];
      if (!next) await api.removeShare(workspace.id, row.userId, id);
      else if (current) await api.updateShare(workspace.id, row.userId, id, next);
      else await api.share(workspace.id, row.email, id, next);
      await changed();
    });

  const removeRow = (row: ShareRow) =>
    run(async () => {
      if (!canManage) return;
      for (const id of Object.keys(row.access) as ProjectId[])
        await api.removeShare(workspace.id, row.userId, id);
      await changed();
    });

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent
        className="max-w-[min(968px,calc(100%-2rem))]"
        data-testid="share-workspace-dialog"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{text.title(workspace.name)}</AlertDialogTitle>
          <AlertDialogDescription>
            {canManage ? text.description : text.readOnlyDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="min-h-0 gap-4">
          {sharing && (
            <TabsList aria-label={text.title(workspace.name)} className="shrink-0">
              <TabsTrigger value="emails">
                <Mail aria-hidden="true" />
                {text.emailsTab}
              </TabsTrigger>
              <TabsTrigger value="link">
                <Link2 aria-hidden="true" />
                {text.linkTab}
              </TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="emails" className="min-h-0 overflow-y-auto">
            <section aria-label={text.people} className="space-y-4">
              <h3 className="text-sm font-semibold">{text.people}</h3>
              {canManage && (
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
                    <SelectField
                      id="share-app"
                      data-testid="share-app-select"
                      value={target}
                      onValueChange={(value) => setTarget(value as ProjectId | typeof ALL_APPS)}
                      className="mt-1"
                      options={[
                        ...PROJECTS.map((project) => ({ value: project.id, label: project.name })),
                        { value: ALL_APPS, label: text.allApps },
                      ]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="share-access">{text.permission}</Label>
                    <SelectField
                      id="share-access"
                      data-testid="share-access-select"
                      value={access}
                      onValueChange={(value) => setAccess(value as WorkspaceShareAccess)}
                      className={cn("mt-1", ACCESS_STYLES[access])}
                      options={accessOptions.filter((option) => option.value !== "")}
                    />
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
              )}
              {error && (
                <p role="alert" data-testid="share-error" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {error && rows === null && (
                <Button variant="outline" disabled={busy} onClick={() => void run(reload)}>
                  {text.publicLink.retry}
                </Button>
              )}
              <div className="overflow-x-auto">
                <div className={cn("space-y-2", canManage && "min-w-[760px]")}>
                  {rows === null ? (
                    !error && <p className="text-sm text-muted-foreground">{text.loading}</p>
                  ) : rows.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{text.empty}</p>
                  ) : (
                    <>
                      <div
                        data-testid="share-column-headings"
                        aria-hidden="true"
                        className="grid items-center gap-2 px-3 text-xs font-semibold text-muted-foreground"
                        style={columns}
                      >
                        <span>{text.email}</span>
                        {projects.map((project) => (
                          <span key={project.id}>{project.name}</span>
                        ))}
                      </div>
                      {rows.map((row) => (
                        <div
                          key={row.userId}
                          data-testid="share-row"
                          className="grid items-center gap-2 rounded-md border border-border px-3 py-2"
                          style={columns}
                        >
                          <span className="min-w-0 truncate text-sm" title={row.email}>
                            {row.email}
                          </span>
                          {projects.map((project) => (
                            <div key={project.id} className="min-w-0 text-xs">
                              {canManage ? (
                                <SelectField
                                  data-testid={`share-row-${project.id}`}
                                  aria-label={text.accessFor(row.email, project.name)}
                                  value={row.access[project.id] ?? ""}
                                  disabled={busy}
                                  onValueChange={(value) =>
                                    void setRowAccess(
                                      row,
                                      project.id,
                                      value as WorkspaceShareAccess | ""
                                    )
                                  }
                                  className={cn(
                                    "h-8 px-2 text-xs",
                                    ACCESS_STYLES[row.access[project.id] ?? ""]
                                  )}
                                  options={accessOptions}
                                />
                              ) : (
                                <span
                                  aria-label={text.accessFor(row.email, project.name)}
                                  className={cn(
                                    "inline-flex items-center gap-2 rounded-md border px-2 py-1",
                                    ACCESS_STYLES[row.access[project.id] ?? "viewer"]
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      "size-2 rounded-full",
                                      ACCESS_DOTS[row.access[project.id] ?? "viewer"]
                                    )}
                                  />
                                  {labels.access[row.access[project.id] ?? "viewer"]}
                                </span>
                              )}
                            </div>
                          ))}
                          {canManage && (
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
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </section>
          </TabsContent>
          {sharing && isOpen && (
            <TabsContent value="link" className="min-h-0 overflow-y-auto">
              <WorkspacePublicLink
                key={workspace.id}
                config={sharing.publicLink}
                canManage={canManage}
                labels={labels}
              />
            </TabsContent>
          )}
        </Tabs>
        <AlertDialogFooter>
          <AlertDialogCancel>{text.close}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
