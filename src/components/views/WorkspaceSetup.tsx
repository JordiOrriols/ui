import { useEffect, useState } from "react";
import { useNameForm } from "../../hooks/useNameForm";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { WorkspaceApi, WorkspaceSummary } from "../../lib/workspaces";
import { getWorkspaceLabels, getWorkspaceLifecycleLabels } from "../../lib/workspace-labels";
import { Button } from "../ui/button";
import { ErrorState } from "./ErrorState";
import { NameDialog } from "./NameDialog";

/** Shown only when a signed-in account has no workspace accessible in the current app. */
export function WorkspaceSetup({
  api,
  language,
  onCreated,
  onRefresh,
  onSignOut,
}: {
  api: WorkspaceApi;
  language: string;
  onCreated: (workspace: WorkspaceSummary) => void | Promise<void>;
  onRefresh: () => Promise<void>;
  onSignOut?: () => Promise<void>;
}) {
  const labels = getWorkspaceLabels(language);
  const copy = getWorkspaceLifecycleLabels(language);
  const [creating, setCreating] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const action = useAsyncAction();
  const form = useNameForm({
    isOpen: creating,
    onSubmit: async (name) => {
      await onCreated(await api.createWorkspace(name));
    },
    onClose: () => setCreating(false),
  });
  const run = action.run;
  useEffect(() => {
    if (!waiting || creating || action.busy) return;
    const timer = setInterval(() => {
      void run(onRefresh);
    }, 15_000);
    return () => clearInterval(timer);
  }, [waiting, creating, action.busy, onRefresh, run]);
  return (
    <section
      className="mx-auto w-full max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8"
      data-testid="workspace-setup"
    >
      <h1 className="text-2xl font-semibold">{waiting ? copy.waiting : copy.title}</h1>
      <p className="text-muted-foreground">
        {waiting ? copy.waitingDescription : copy.description}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button disabled={action.busy} onClick={() => setCreating(true)}>
          {labels.create.submit}
        </Button>
        {waiting ? (
          <Button variant="outline" disabled={action.busy} onClick={() => void run(onRefresh)}>
            {copy.refresh}
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setWaiting(true)}>
            {copy.wait}
          </Button>
        )}
        {onSignOut && (
          <Button variant="ghost" disabled={action.busy} onClick={() => void run(onSignOut)}>
            {copy.signOut}
          </Button>
        )}
      </div>
      {action.error && <ErrorState message={action.error} />}
      <NameDialog
        isOpen={creating}
        onClose={() => setCreating(false)}
        form={form}
        labels={labels.create}
      />
    </section>
  );
}
