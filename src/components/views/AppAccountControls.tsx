import { useEffect, useState } from "react";
import type { AuthActions } from "../../hooks/useSupabaseAuth";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { AccountButton } from "./AccountButton";
import { AuthDialog, type AuthDialogProps } from "./AuthDialog";
import { ErrorState } from "./ErrorState";
import type { ProjectId } from "../../lib/projects";

export interface AppAccountControlsProps extends Omit<
  AuthDialogProps,
  "isOpen" | "onClose" | "initialMode" | "actions"
> {
  projectId: ProjectId;
  signedIn: boolean;
  enabled: boolean;
  actions: AuthDialogProps["actions"] & Pick<AuthActions, "signOut">;
  signOutLabel: string;
  accountTitle?: string;
  authError?: string | null;
}

export function AppAccountControls({
  projectId,
  signedIn,
  enabled,
  actions,
  signOutLabel,
  accountTitle,
  authError,
  ...dialog
}: AppAccountControlsProps) {
  const [open, setOpen] = useState(false);
  const action = useAsyncAction();
  useEffect(() => {
    setOpen(false);
    action.reset();
  }, [signedIn, enabled, action.reset]);

  return (
    <>
      {enabled && (
        <AccountButton
          projectId={projectId}
          type={signedIn ? "signOut" : "signIn"}
          label={signedIn ? signOutLabel : dialog.labels.signIn}
          title={accountTitle}
          disabled={action.busy}
          onClick={signedIn ? () => void action.run(actions.signOut) : () => setOpen(true)}
        />
      )}
      {authError && <ErrorState message={dialog.formatError(authError)} />}
      {action.error && <ErrorState message={dialog.formatError(action.error)} />}
      <AuthDialog
        {...dialog}
        actions={actions}
        isOpen={open && enabled && !signedIn}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
