import { useState } from "react";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown, Plus, Share2 } from "lucide-react";
import { useNameForm } from "../../hooks/useNameForm";
import type { ProjectId } from "../../lib/projects";
import type { WorkspaceApi, WorkspaceSummary } from "../../lib/workspaces";
import type { WorkspaceLabels } from "../../lib/workspace-labels";
import { Button, buttonVariants } from "../ui/button";
import { NameDialog } from "./NameDialog";
import { WorkspaceShareDialog } from "./WorkspaceShareDialog";

const itemClassName =
  "flex items-center gap-2 rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-muted";

/**
 * The workspace picker every app shows next to its tabs: switch or create a workspace,
 * and, as its owner, share it per app. Pass a stable `api` (create it once per client).
 */
export function WorkspaceBar({
  api,
  app,
  workspaces,
  value,
  onValueChange,
  onCreated,
  onSharesChanged,
  labels,
}: {
  api: WorkspaceApi;
  app: ProjectId;
  workspaces: WorkspaceSummary[];
  value: string;
  onValueChange: (id: string) => void;
  onCreated: (workspace: WorkspaceSummary) => void | Promise<void>;
  onSharesChanged?: () => void | Promise<void>;
  labels: WorkspaceLabels;
}) {
  const [creating, setCreating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const current = workspaces.find((workspace) => workspace.id === value);
  const nameForm = useNameForm({
    isOpen: creating,
    onSubmit: async (name) => {
      const created = await api.createWorkspace(name);
      await onCreated(created);
    },
    onClose: () => setCreating(false),
  });
  return (
    <div className="flex items-center gap-2" data-testid="workspace-bar">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className={buttonVariants({ variant: "outline", size: "sm" })}
          aria-label={labels.workspace}
          title={current?.name}
          data-testid="workspace-switcher"
        >
          <span className="max-w-32 truncate sm:max-w-48">{current?.name ?? labels.workspace}</span>
          {current && (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {labels.access[current.access_level]}
            </span>
          )}
          <ChevronDown className="size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className="z-50 max-h-80 min-w-56 overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-lg"
          >
            <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
              {workspaces.map((workspace) => (
                <DropdownMenu.RadioItem
                  key={workspace.id}
                  value={workspace.id}
                  className={itemClassName}
                >
                  <span className="size-4">
                    <DropdownMenu.ItemIndicator>
                      <Check className="size-4" />
                    </DropdownMenu.ItemIndicator>
                  </span>
                  <span className="max-w-64 truncate">{workspace.name}</span>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
            {workspaces.length > 0 && <DropdownMenu.Separator className="my-1 h-px bg-border" />}
            <DropdownMenu.Item className={itemClassName} onSelect={() => setCreating(true)}>
              <Plus className="size-4" />
              {labels.newWorkspace}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {current?.access_level === "owner" && (
        <Button
          eventId="workspace_share_open"
          data-testid="workspace-share"
          variant="outline"
          size="sm"
          onClick={() => setSharing(true)}
        >
          <Share2 className="size-4" />
          {labels.share}
        </Button>
      )}
      <NameDialog
        isOpen={creating}
        onClose={() => setCreating(false)}
        form={nameForm}
        eventId="workspace_create"
        labels={labels.create}
      />
      {current && (
        <WorkspaceShareDialog
          isOpen={sharing}
          onClose={() => setSharing(false)}
          api={api}
          workspace={current}
          app={app}
          labels={labels}
          onChanged={onSharesChanged}
        />
      )}
    </div>
  );
}
