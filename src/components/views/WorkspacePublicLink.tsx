import { useEffect, useState } from "react";
import { Globe, Link2 } from "lucide-react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { WorkspaceLabels } from "../../lib/workspace-labels";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ConfirmDialog } from "./ConfirmDialog";

export interface WorkspacePublicLinkConfig {
  load: () => Promise<string | null>;
  setEnabled: (enabled: boolean) => Promise<string | null>;
  getUrl: (token: string) => string;
  description: string;
}

export function WorkspacePublicLink({
  config,
  canManage,
  labels,
}: {
  config: WorkspacePublicLinkConfig;
  canManage: boolean;
  labels: WorkspaceLabels;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const action = useAsyncAction();
  const text = labels.shareDialog.publicLink;
  const { load } = config;

  useEffect(() => {
    let active = true;
    setLoaded(false);
    setToken(null);
    setCopied(false);
    void action.run(async () => {
      const next = await load();
      if (active) {
        setToken(next);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [load, action.run]);

  const change = (enabled: boolean) => {
    if (!canManage || action.busy) return;
    void action.run(async () => {
      const next = await config.setEnabled(enabled);
      if (enabled ? !next : next !== null) throw new Error(text.unavailable);
      setToken(next);
      setCopied(false);
      setRevoking(false);
    });
  };
  const url = token ? config.getUrl(token) : "";

  return (
    <section aria-label={text.title} className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Globe className="size-4" aria-hidden="true" />
        {text.title}
      </h3>
      <p className="text-sm text-muted-foreground">{config.description}</p>
      {action.error && (
        <p role="alert" className="text-sm text-destructive">
          {action.error}
        </p>
      )}
      {!loaded ? (
        action.error ? (
          <Button
            variant="outline"
            disabled={action.busy}
            onClick={() =>
              void action.run(async () => {
                setToken(await config.load());
                setLoaded(true);
              })
            }
          >
            {text.retry}
          </Button>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">
            {labels.shareDialog.loading}
          </p>
        )
      ) : url ? (
        <>
          <Input
            aria-label={text.link}
            readOnly
            value={url}
            onFocus={(event) => event.target.select()}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={action.busy}
              onClick={() =>
                void action.run(async () => {
                  setCopied(false);
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                })
              }
            >
              <Link2 className="size-4" aria-hidden="true" />
              {copied ? text.copied : text.copy}
            </Button>
            <Button variant="outline" asChild>
              <a href={url} target="_blank" rel="noreferrer">
                {text.open}
              </a>
            </Button>
            {canManage && (
              <Button variant="outline" disabled={action.busy} onClick={() => setRevoking(true)}>
                {text.revoke}
              </Button>
            )}
          </div>
          {copied && (
            <p role="status" className="text-xs text-muted-foreground">
              {text.copied}
            </p>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{text.disabled}</p>
          {canManage && (
            <Button variant="outline" disabled={action.busy} onClick={() => change(true)}>
              {text.enable}
            </Button>
          )}
        </div>
      )}
      <ConfirmDialog
        isOpen={revoking}
        title={text.revoke}
        description={text.revokeDescription}
        confirmLabel={text.revoke}
        cancelLabel={labels.shareDialog.close}
        onCancel={() => {
          if (!action.busy) setRevoking(false);
        }}
        onConfirm={() => change(false)}
      />
    </section>
  );
}
